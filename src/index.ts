import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { HELP, parseArgs } from "./args.ts";
import type { CliOptions } from "./args.ts";
import {
  applyPlaceholders,
  copyTemplate,
  emptyDir,
  exists,
  isDirectory,
  isEmptyDir,
  writeProjectManifest,
} from "./fs.ts";
import { DEFAULT_PROJECT_NAME, isValidPackageName, toValidPackageName } from "./project-name.ts";
import { CancelError, confirm, isInteractive, select, text } from "./prompts.ts";
import {
  detectPackageManager,
  installCommand,
  installDependencies,
  initGitRepository,
  PACKAGE_MANAGERS,
  runScriptCommand,
  startDevServer,
} from "./system.ts";
import type { PackageManager } from "./system.ts";
import { DEFAULT_TEMPLATE, findTemplate, TEMPLATES } from "./templates.ts";
import type { Template } from "./templates.ts";
import { color, intro, log, outro, spinner, write } from "./ui.ts";

const LINKS = {
  discord: "https://discord.gg/WnVTMCTz74",
  docs: "https://ilha.build",
  repository: "https://github.com/ilhajs/ilha",
  serverIslands: "https://ilha.build/guide/routing/server-islands/",
  showcase: "https://ilha.build/guide/resources/showcase/",
};

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const templatesRoot = path.join(packageRoot, "templates");

const readVersion = async () => {
  try {
    const manifest = await readFile(path.join(packageRoot, "package.json"), "utf-8");
    return (JSON.parse(manifest) as { version?: string }).version ?? "0.0.0";
  } catch {
    return "0.0.0";
  }
};

const validateDirectory = (value: string) =>
  value.trim().length === 0 ? "Please enter a project directory" : undefined;

const printTemplates = () => {
  write(`\n${color.bold("Available templates")}\n\n`);
  for (const template of TEMPLATES) {
    write(`  ${color.cyan(template.id.padEnd(18))}${template.label}\n`);
    write(`  ${" ".repeat(18)}${color.dim(template.description)}\n\n`);
  }
  write(`  ${color.dim(`Use: create-ilha my-app --template ${DEFAULT_TEMPLATE}`)}\n\n`);
};

const resolveTemplate = async (options: CliOptions, interactive: boolean): Promise<Template> => {
  if (options.template) {
    const match = findTemplate(options.template);
    if (match) {
      return match;
    }
    log.warn(`Unknown template ${color.bold(options.template)}. Pick one below.`);
    if (!interactive) {
      throw new Error(`Unknown template: ${options.template}. Run with --list to see all names.`);
    }
  } else if (!interactive) {
    const fallback = findTemplate(DEFAULT_TEMPLATE);
    if (!fallback) {
      throw new Error(`Missing default template: ${DEFAULT_TEMPLATE}`);
    }
    return fallback;
  }

  const id = await select({
    initial: DEFAULT_TEMPLATE,
    message: "Which template?",
    options: TEMPLATES.map((template) => ({
      hint: template.hint,
      label: template.label,
      value: template.id,
    })),
  });
  const chosen = findTemplate(id);
  if (!chosen) {
    throw new Error(`Missing template: ${id}`);
  }
  return chosen;
};

const resolveTargetDirectory = async (options: CliOptions, interactive: boolean) => {
  if (options.directory) {
    return options.directory;
  }
  if (!interactive) {
    return DEFAULT_PROJECT_NAME;
  }
  const answer = await text({
    initial: DEFAULT_PROJECT_NAME,
    message: "Where should we create your project?",
    placeholder: DEFAULT_PROJECT_NAME,
    validate: validateDirectory,
  });
  return answer;
};

const ensureTargetIsUsable = async (
  targetDir: string,
  options: CliOptions,
  interactive: boolean
) => {
  if (!(await exists(targetDir))) {
    return;
  }
  if (!(await isDirectory(targetDir))) {
    throw new Error(`${targetDir} exists and is not a directory.`);
  }
  if (await isEmptyDir(targetDir)) {
    return;
  }
  const relative = path.relative(process.cwd(), targetDir) || ".";
  if (options.overwrite) {
    await emptyDir(targetDir);
    log.step(`Cleared ${color.bold(relative)}`);
    return;
  }
  if (!interactive) {
    throw new Error(`${relative} is not empty. Re-run with --force to overwrite its contents.`);
  }
  const action = await select({
    message: `${relative} is not empty. What now?`,
    options: [
      { hint: "keeps .git", label: "Remove existing files and continue", value: "clear" },
      { hint: "may overwrite files", label: "Continue anyway", value: "ignore" },
      { label: "Cancel", value: "cancel" },
    ],
  });
  if (action === "cancel") {
    throw new CancelError();
  }
  if (action === "clear") {
    await emptyDir(targetDir);
  }
};

const resolvePackageManager = async (options: CliOptions, interactive: boolean) => {
  const detected = detectPackageManager();
  if (options.packageManager) {
    return options.packageManager;
  }
  if (!interactive) {
    return detected;
  }
  return await select<PackageManager>({
    initial: detected,
    message: "Which package manager?",
    options: PACKAGE_MANAGERS.map((manager) => ({
      hint: manager === detected ? "detected" : undefined,
      label: manager,
      value: manager,
    })),
  });
};

const askYesNo = async (
  value: boolean | undefined,
  interactive: boolean,
  message: string,
  fallback: boolean
) => {
  if (value !== undefined) {
    return value;
  }
  if (!interactive) {
    return fallback;
  }
  return await confirm({ initial: fallback, message });
};

const printNextSteps = ({
  installed,
  manager,
  relative,
  template,
}: {
  installed: boolean;
  manager: PackageManager;
  relative: string;
  template: Template;
}) => {
  write(`\n${color.bold("Next steps")}\n\n`);
  let step = 1;
  const line = (command: string) => {
    write(`  ${color.dim(`${step}.`)} ${color.cyan(command)}\n`);
    step += 1;
  };
  if (relative !== ".") {
    line(`cd ${relative}`);
  }
  if (!installed) {
    line(installCommand(manager));
  }
  line(runScriptCommand(manager, "dev"));

  write(`\n${color.bold("Learn more")}\n\n`);
  write(`  ${color.dim("Docs")}          ${color.underline(LINKS.docs)}\n`);
  if (template.id === "oxide-spa" || template.id === "blog") {
    write(`  ${color.dim("Server islands")} ${color.underline(LINKS.serverIslands)}\n`);
  }
  write(`  ${color.dim("Showcase")}      ${color.underline(LINKS.showcase)}\n`);
  write(`  ${color.dim("Discord")}       ${color.underline(LINKS.discord)}\n`);
  write(`  ${color.dim("GitHub")}        ${color.underline(LINKS.repository)}\n`);
};

const scaffold = async (options: CliOptions) => {
  const interactive = isInteractive() && !options.yes;

  intro("create-ilha");

  const rawDirectory = await resolveTargetDirectory(options, interactive);
  const targetDir = path.resolve(process.cwd(), rawDirectory.trim());
  const relative = path.relative(process.cwd(), targetDir) || ".";

  await ensureTargetIsUsable(targetDir, options, interactive);

  const template = await resolveTemplate(options, interactive);
  const templateDir = path.join(templatesRoot, template.id);
  if (!(await isDirectory(templateDir))) {
    throw new Error(`Template files are missing for "${template.id}" (looked in ${templateDir}).`);
  }

  const suggestedName = toValidPackageName(path.basename(targetDir));
  const projectName =
    interactive && !options.directory
      ? toValidPackageName(
          await text({
            initial: suggestedName,
            message: "Package name?",
            placeholder: suggestedName,
            validate: (value) =>
              isValidPackageName(value.trim()) ? undefined : "Not a valid npm package name",
          })
        )
      : suggestedName;

  const manager = await resolvePackageManager(options, interactive);
  const shouldInstall = await askYesNo(options.install, interactive, "Install dependencies?", true);
  const shouldInitGit = await askYesNo(
    options.git,
    interactive,
    "Initialize a git repository?",
    true
  );

  const copying = spinner(`Scaffolding ${color.bold(template.label)} in ${relative}`);
  try {
    await copyTemplate(templateDir, targetDir);
    await applyPlaceholders(targetDir, {
      packageManager: manager,
      projectName,
      templateLabel: template.label,
    });
    await writeProjectManifest(targetDir, projectName);
  } catch (error) {
    copying.fail("Could not copy the template");
    throw error;
  }
  copying.stop(`Created ${color.bold(projectName)} from ${template.label}`);

  let installed = false;
  if (shouldInstall) {
    const installing = spinner(`Installing dependencies with ${manager}`);
    try {
      await installDependencies(manager, targetDir);
      installing.stop("Dependencies installed");
      installed = true;
    } catch (error) {
      installing.fail(`${manager} install failed — run it yourself in ${relative}`);
      log.step(color.dim(error instanceof Error ? error.message : String(error)));
    }
  }

  if (shouldInitGit) {
    try {
      await initGitRepository(targetDir, "chore: initial commit from create-ilha");
      log.success("Initialized a git repository");
    } catch {
      log.warn("Could not create the initial commit — is git configured?");
    }
  }

  printNextSteps({ installed, manager, relative, template });
  outro("Happy building with Ilha!");

  const askedToStart =
    options.start ??
    (installed && interactive
      ? await confirm({ initial: false, message: "Start the dev server now?" })
      : false);

  if (!askedToStart) {
    return;
  }
  if (installed) {
    await startDevServer(manager, targetDir);
    return;
  }
  log.warn(`Skipping the dev server: run ${installCommand(manager)} in ${relative} first.`);
};

const main = async () => {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    write(HELP);
    return;
  }
  if (options.version) {
    write(`create-ilha v${await readVersion()}\n`);
    return;
  }
  if (options.list) {
    printTemplates();
    return;
  }
  if (options.unknown.length > 0) {
    log.error(`Unknown option: ${options.unknown.join(", ")}`);
    write(HELP);
    process.exitCode = 1;
    return;
  }

  await scaffold(options);
};

try {
  await main();
} catch (error) {
  log.blank();
  if (error instanceof CancelError) {
    log.warn("Cancelled. No files were written.");
    process.exitCode = 130;
  } else {
    log.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
