#!/usr/bin/env node
/**
 * Verifies that every publishable workspace package already exists on npm.
 *
 * npm trusted publishing (OIDC) can only publish versions of packages that
 * already exist. A new package must be bootstrapped once with
 * `pnpm release:bootstrap <name>` before it can be released by CI.
 *
 * This script is dependency-free and can run before `pnpm install`.
 */

import {
  displayPath,
  errorMessage,
  publishablePackages,
  registryInfo,
  registryUrl,
  selectPackages,
  type WorkspacePackage,
} from "./lib.ts";

interface PreflightOptions {
  json: boolean;
  help: boolean;
  names: string[];
}

interface PackageCheck {
  pkg: WorkspacePackage;
  exists: boolean;
  error: string | null;
}

function parseArgs(args: string[]): PreflightOptions {
  const options: PreflightOptions = { json: false, help: false, names: [] };
  for (const arg of args) {
    if (arg === "--json") {
      options.json = true;
    } else if (arg === "--help" || arg === "-h") {
      options.help = true;
    } else if (arg.startsWith("-")) {
      throw new Error(`Unknown option: ${arg}`);
    } else {
      options.names.push(arg);
    }
  }
  return options;
}

function printUsage(): void {
  console.log(`Usage: pnpm release:check [package...]

Checks that publishable workspace packages exist on npm before a release.
Without arguments, checks every publishable package in the workspace.

Options:
  --json    Print a machine-readable report
  --help    Show this help

Exit codes:
  0  All checked packages exist
  1  At least one package is missing or could not be checked
`);
}

async function mapConcurrent<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let nextIndex = 0;
  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    async () => {
      while (true) {
        const index = nextIndex++;
        if (index >= items.length) {
          return;
        }
        results[index] = await fn(items[index]!);
      }
    }
  );
  await Promise.all(workers);
  return results;
}

function printMissing(missing: PackageCheck[]): void {
  console.error(
    `\n✗ ${missing.length} package${missing.length === 1 ? " is" : "s are"} missing from the npm registry:`
  );
  for (const { pkg } of missing) {
    console.error(`  ${pkg.name} (${displayPath(pkg.dir)})`);
  }
  const names = missing.map(({ pkg }) => pkg.name).join(" ");
  console.error(`
npm trusted publishing can only publish packages that already exist.
Bootstrap each missing package before merging or releasing:

  pnpm release:bootstrap ${names}

See scripts/release/README.md for the full one-time setup.`);
}

function printErrors(errors: PackageCheck[]): void {
  console.error(
    `\n✗ Could not check ${errors.length} package${errors.length === 1 ? "" : "s"}:`
  );
  for (const { pkg, error } of errors) {
    console.error(`  ${pkg.name}: ${error}`);
  }
}

async function main(): Promise<number> {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printUsage();
    return 0;
  }

  const packages =
    options.names.length > 0
      ? selectPackages(options.names)
      : publishablePackages();
  const registry = registryUrl();

  if (!options.json) {
    console.log(
      `Checking ${packages.length} publishable package${packages.length === 1 ? "" : "s"} on ${registry}...`
    );
  }

  const checks = await mapConcurrent(packages, 8, async (pkg) => {
    try {
      return {
        pkg,
        exists: (await registryInfo(pkg.name, registry)) !== null,
        error: null,
      } satisfies PackageCheck;
    } catch (error) {
      return {
        pkg,
        exists: false,
        error: errorMessage(error),
      } satisfies PackageCheck;
    }
  });

  const missing = checks.filter(
    (check) => !check.exists && check.error === null
  );
  const errors = checks.filter((check) => check.error !== null);

  if (options.json) {
    console.log(
      JSON.stringify(
        {
          registry,
          checked: checks.length,
          missing: missing.map(({ pkg }) => ({
            name: pkg.name,
            version: pkg.version,
            dir: displayPath(pkg.dir),
          })),
          errors: errors.map(({ pkg, error }) => ({
            name: pkg.name,
            dir: displayPath(pkg.dir),
            error,
          })),
        },
        null,
        2
      )
    );
  } else if (missing.length === 0 && errors.length === 0) {
    console.log(
      `✓ All ${checks.length} package${checks.length === 1 ? "" : "s"} exist on npm.`
    );
  } else {
    if (missing.length > 0) {
      printMissing(missing);
    }
    if (errors.length > 0) {
      printErrors(errors);
    }
  }

  return missing.length === 0 && errors.length === 0 ? 0 : 1;
}

main()
  .then((exitCode) => {
    process.exitCode = exitCode;
  })
  .catch((error) => {
    console.error(`\n✗ ${errorMessage(error)}`);
    process.exitCode = 1;
  });
