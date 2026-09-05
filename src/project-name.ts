/** Project-name helpers shared by the prompts and the scaffolder. */

export const DEFAULT_PROJECT_NAME = "ilha-app";

/** Strip a directory name down to something npm accepts as a package name. */
export const toValidPackageName = (input: string) => {
  const name = input
    .trim()
    .toLowerCase()
    .replace(/^[._]+/u, "")
    .replaceAll(/[^a-z0-9@\-~._/]+/gu, "-")
    .replaceAll(/^-+|-+$/gu, "");
  return name.length > 0 ? name : DEFAULT_PROJECT_NAME;
};

export const isValidPackageName = (name: string) =>
  /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/u.test(name);
