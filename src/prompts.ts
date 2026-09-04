/**
 * Dependency-free interactive prompts (text, select, confirm).
 *
 * Every prompt throws {@link CancelError} when the user hits Ctrl+C or Escape,
 * so callers can unwind to a single "operation cancelled" exit path.
 */

import { color, cursor, symbols, write } from "./ui.ts";

export class CancelError extends Error {
  constructor() {
    super("Operation cancelled");
    this.name = "CancelError";
  }
}

export interface SelectOption<Value extends string> {
  value: Value;
  label: string;
  hint?: string;
}

const KEY = {
  backspace: "\u007F",
  ctrlC: "\u0003",
  ctrlD: "\u0004",
  down: "\u001B[B",
  enter: "\r",
  escape: "\u001B",
  newline: "\n",
  up: "\u001B[A",
};

export const isInteractive = () => Boolean(process.stdin.isTTY && process.stdout.isTTY);

/** Split a raw stdin chunk into individual keys, keeping escape sequences whole. */
const splitKeys = (chunk: string): string[] => {
  const keys: string[] = [];
  let index = 0;
  while (index < chunk.length) {
    const char = chunk[index] ?? "";
    if (char === "\u001B" && chunk[index + 1] === "[") {
      let end = index + 2;
      while (end < chunk.length && !/[A-Za-z~]/u.test(chunk[end] ?? "")) {
        end += 1;
      }
      keys.push(chunk.slice(index, end + 1));
      index = end + 1;
      continue;
    }
    keys.push(char);
    index += 1;
  }
  return keys;
};

const readKeys = (onKey: (key: string) => boolean | undefined) =>
  // Raw keypresses arrive as stdin events; a promise is how we await one.
  // oxlint-disable-next-line promise/avoid-new
  new Promise<void>((resolve, reject) => {
    const { stdin } = process;
    const wasRaw = Boolean(stdin.isRaw);
    stdin.setRawMode?.(true);
    stdin.resume();
    stdin.setEncoding("utf-8");

    const cleanup = (listener: (chunk: string) => void) => {
      stdin.off("data", listener);
      stdin.setRawMode?.(wasRaw);
      stdin.pause();
    };

    const onData = (chunk: string) => {
      let done = false;
      // A single read can carry several keys (fast typing, paste, held arrow).
      for (const key of splitKeys(chunk)) {
        if (key === KEY.ctrlC || key === KEY.ctrlD || key === KEY.escape) {
          cleanup(onData);
          reject(new CancelError());
          return;
        }
        if (onKey(key) === true) {
          done = true;
          break;
        }
      }
      if (done) {
        cleanup(onData);
        resolve();
      }
    };

    stdin.on("data", onData);
  });

const question = (message: string) => `${color.cyan(symbols.info)} ${color.bold(message)}`;

const answered = (message: string, answer: string) =>
  `${color.green(symbols.success)} ${color.bold(message)} ${color.dim(answer)}\n`;

export interface TextOptions {
  message: string;
  /** Used when the answer is left empty. Shown dimmed until the user types. */
  initial?: string;
  placeholder?: string;
  validate?: (value: string) => string | undefined;
}

export const text = async ({
  initial = "",
  message,
  placeholder,
  validate,
}: TextOptions): Promise<string> => {
  // Starts empty: the initial value is a suggestion, not pre-filled text the
  // user would have to erase before typing their own.
  let value = "";
  let error: string | undefined;
  const hintText = placeholder ?? initial;

  const render = () => {
    const shown = value.length > 0 ? value : color.dim(hintText);
    const hint = error ? `  ${color.red(`${symbols.error} ${error}`)}` : "";
    write(`${cursor.toColumnStart}${cursor.clearLine}${question(message)} ${shown}${hint}`);
  };

  render();
  await readKeys((key) => {
    if (key === KEY.enter || key === KEY.newline) {
      const candidate = value.length > 0 ? value : initial;
      const problem = validate?.(candidate);
      if (problem) {
        error = problem;
        value = candidate;
        render();
        return;
      }
      value = candidate;
      return true;
    }
    if (key === KEY.backspace) {
      value = value.slice(0, -1);
      error = undefined;
      render();
      return;
    }
    // Ignore escape sequences and other control characters.
    if (key.length === 1 && key >= " ") {
      value += key;
      error = undefined;
      render();
    }
  });

  write(`${cursor.toColumnStart}${cursor.clearLine}`);
  write(answered(message, value));
  return value;
};

export interface SelectOptions<Value extends string> {
  message: string;
  options: SelectOption<Value>[];
  initial?: Value;
}

export const select = async <Value extends string>({
  initial,
  message,
  options,
}: SelectOptions<Value>): Promise<Value> => {
  if (options.length === 0) {
    throw new Error("select() needs at least one option");
  }
  const startIndex = options.findIndex((option) => option.value === initial);
  let index = startIndex === -1 ? 0 : startIndex;
  let printed = 0;

  const render = () => {
    if (printed > 0) {
      write(`${cursor.up(printed)}${cursor.toColumnStart}${cursor.clearDown}`);
    }
    const lines = [question(message)];
    for (const [position, option] of options.entries()) {
      const active = position === index;
      const marker = active ? color.magenta(symbols.radioOn) : color.dim(symbols.radioOff);
      const label = active ? color.bold(option.label) : option.label;
      const hint = option.hint ? ` ${color.dim(option.hint)}` : "";
      lines.push(`${color.dim(symbols.bar)} ${marker} ${label}${hint}`);
    }
    write(`${lines.join("\n")}\n`);
    printed = lines.length;
  };

  render();
  await readKeys((key) => {
    if (key === KEY.enter || key === KEY.newline) {
      return true;
    }
    if (key === KEY.up || key === "k") {
      index = (index - 1 + options.length) % options.length;
      render();
      return;
    }
    if (key === KEY.down || key === "j") {
      index = (index + 1) % options.length;
      render();
    }
  });

  write(`${cursor.up(printed)}${cursor.toColumnStart}${cursor.clearDown}`);
  const chosen = options[index];
  if (!chosen) {
    throw new Error("No option selected");
  }
  write(answered(message, chosen.label));
  return chosen.value;
};

export const confirm = async ({
  initial = true,
  message,
}: {
  message: string;
  initial?: boolean;
}): Promise<boolean> => {
  const value = await select({
    initial: initial ? "yes" : "no",
    message,
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
    ],
  });
  return value === "yes";
};
