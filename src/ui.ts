/**
 * Tiny ANSI helpers and the shared log surface for the CLI.
 *
 * No runtime dependencies on purpose: a `create-*` package is downloaded on
 * every run, so it has to stay small and start fast.
 */

const CSI = "\u001B[";

const NO_COLOR =
  Boolean(process.env.NO_COLOR) ||
  process.env.TERM === "dumb" ||
  (!process.stdout.isTTY && !process.env.FORCE_COLOR);

const wrap = (open: number, close: number) => (input: string) =>
  NO_COLOR ? input : `${CSI}${open}m${input}${CSI}${close}m`;

export const color = {
  bold: wrap(1, 22),
  cyan: wrap(36, 39),
  dim: wrap(2, 22),
  green: wrap(32, 39),
  magenta: wrap(35, 39),
  red: wrap(31, 39),
  underline: wrap(4, 24),
  yellow: wrap(33, 39),
};

export const symbols = {
  bar: "│",
  error: "✖",
  info: "◆",
  pointer: "❯",
  radioOff: "○",
  radioOn: "●",
  success: "✔",
  warn: "▲",
};

export const cursor = {
  clearDown: `${CSI}0J`,
  clearLine: `${CSI}2K`,
  hide: `${CSI}?25l`,
  show: `${CSI}?25h`,
  toColumnStart: `${CSI}G`,
  up: (lines: number) => (lines > 0 ? `${CSI}${lines}A` : ""),
};

export const write = (text: string) => {
  process.stdout.write(text);
};

export const log = {
  blank: () => write("\n"),
  error: (message: string) => write(`${color.red(symbols.error)} ${message}\n`),
  info: (message: string) => write(`${color.cyan(symbols.info)} ${message}\n`),
  plain: (message: string) => write(`${message}\n`),
  step: (message: string) => write(`${color.dim(symbols.bar)} ${message}\n`),
  success: (message: string) => write(`${color.green(symbols.success)} ${message}\n`),
  warn: (message: string) => write(`${color.yellow(symbols.warn)} ${message}\n`),
};

export const intro = (title: string) => {
  write(`\n${color.magenta(color.bold(title))}\n\n`);
};

export const outro = (message: string) => {
  write(`\n${color.green(message)}\n`);
};

export interface Spinner {
  fail: (message: string) => void;
  stop: (message: string) => void;
}

/** Minimal spinner. Prints a single static line when stdout is not a TTY. */
export const spinner = (label: string): Spinner => {
  if (!process.stdout.isTTY) {
    write(`${color.dim(symbols.bar)} ${label}\n`);
    return {
      fail: (message: string) => log.error(message),
      stop: (message: string) => log.success(message),
    };
  }

  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  let index = 0;
  write(cursor.hide);
  const timer = setInterval(() => {
    index = (index + 1) % frames.length;
    const frame = frames[index] ?? "";
    write(`${cursor.clearLine}${cursor.toColumnStart}${color.magenta(frame)} ${label}`);
  }, 80);

  const end = (icon: string, message: string) => {
    clearInterval(timer);
    write(`${cursor.clearLine}${cursor.toColumnStart}${icon} ${message}\n${cursor.show}`);
  };

  return {
    fail: (message: string) => end(color.red(symbols.error), message),
    stop: (message: string) => end(color.green(symbols.success), message),
  };
};
