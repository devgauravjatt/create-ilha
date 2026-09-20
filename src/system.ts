/**
 * Package-manager detection plus the few child processes the CLI shells out to.
 */

import { spawn } from "cross-spawn";

export const PACKAGE_MANAGERS = ["npm", "pnpm", "yarn", "bun"] as const;

export type PackageManager = (typeof PACKAGE_MANAGERS)[number];

export const isPackageManager = (value: string): value is PackageManager =>
  (PACKAGE_MANAGERS as readonly string[]).includes(value);

/**
 * `npm create`, `pnpm create`, `yarn create` and `bun create` all set
 * `npm_config_user_agent`, so the manager that launched us is the best default.
 */
export const detectPackageManager = (): PackageManager => {
  const agent = process.env.npm_config_user_agent ?? "";
  const [name] = agent.split("/");
  if (name && isPackageManager(name)) {
    return name;
  }
  return "npm";
};

export const runCommand = (
  command: string,
  args: string[],
  options: { cwd: string; stdio?: "ignore" | "inherit" }
) =>
  // A promise wrapper is the only way to await a child process's exit event.
  // oxlint-disable-next-line promise/avoid-new
  new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      stdio: options.stdio ?? "ignore",
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${command} ${args.join(" ")} exited with code ${code ?? "unknown"}`));
    });
  });

export const installDependencies = (manager: PackageManager, cwd: string) =>
  runCommand(manager, ["install"], { cwd });

export const initGitRepository = async (cwd: string, message: string) => {
  await runCommand("git", ["init"], { cwd });
  await runCommand("git", ["add", "-A"], { cwd });
  await runCommand("git", ["commit", "--no-verify", "--no-gpg-sign", "-m", message], { cwd });
};

/** The command a user types to run a script with their package manager. */
export const runScriptCommand = (manager: PackageManager, script: string) =>
  manager === "npm" ? `npm run ${script}` : `${manager} run ${script}`;

export const installCommand = (manager: PackageManager) => `${manager} install`;

export const startDevServer = (manager: PackageManager, cwd: string) =>
  runCommand(manager, ["run", "dev"], { cwd, stdio: "inherit" });
