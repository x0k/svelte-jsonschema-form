#!/usr/bin/env node
/**
 * Bootstraps npm trusted publishing for packages that do not exist yet.
 *
 * npm trusted publishers require an existing package. Staging a throwaway
 * `0.0.0-bootstrap` version reserves the name and lets `npm trust github`
 * configure the OIDC publisher. The real release can then be published by the
 * GitHub Actions workflow.
 *
 * Staging and trust setup require an authenticated npm session. 2FA prompts
 * are intentionally left interactive; everything else is automated.
 */

import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createInterface } from "node:readline/promises";

import {
  bootstrapDir,
  bootstrapTag,
  bootstrapVersion,
  displayPath,
  errorMessage,
  listStagedEntries,
  readReleaseConfig,
  realVersions,
  registryVersions,
  runCommand,
  selectPackages,
  sleep,
  stagePlaceholderVersion,
  trustArgs,
  type ReleaseConfig,
  type WorkspacePackage,
} from "./lib.ts";

interface BootstrapOptions {
  cleanup: boolean;
  dryRun: boolean;
  trust: boolean;
  yes: boolean;
  help: boolean;
  names: string[];
}

function parseArgs(args: string[]): BootstrapOptions {
  const options: BootstrapOptions = {
    cleanup: false,
    dryRun: false,
    trust: true,
    yes: false,
    help: false,
    names: [],
  };
  for (const arg of args) {
    if (arg === "--cleanup") {
      options.cleanup = true;
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--no-trust") {
      options.trust = false;
    } else if (arg === "--trust") {
      options.trust = true;
    } else if (arg === "--yes" || arg === "-y") {
      options.yes = true;
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
  console.log(`Usage:
  pnpm release:bootstrap [--dry-run] [--no-trust] <package...>
  pnpm release:cleanup [--dry-run] [--yes] <package...>

Bootstraps a new package so npm trusted publishing can release it:
  1. Stages a throwaway ${bootstrapVersion} version (creates the package name).
  2. Configures the GitHub Actions trusted publisher.
  3. Prints the release and cleanup steps.

Cleanup rejects the staged bootstrap entry after a real version is published.

Options:
  --cleanup   Reject staged bootstrap entries instead of creating them
  --dry-run   Print commands without running them
  --no-trust  Only stage the package; print the npm trust command
  --yes, -y   Skip cleanup confirmation prompts (required in non-TTY shells)
  --help      Show this help
`);
}

function createBootstrapManifest(
  pkg: WorkspacePackage,
  config: ReleaseConfig
): string {
  const dir = bootstrapDir(pkg);
  mkdirSync(dir, { recursive: true });
  const manifest = {
    name: pkg.name,
    version: bootstrapVersion,
    private: false,
    description: `Temporary package used to bootstrap npm trusted publishing for ${pkg.name}.`,
    license: "MIT",
    repository: {
      type: "git",
      url: `git+https://github.com/${config.repo}.git`,
      directory: displayPath(pkg.dir),
    },
  };
  writeFileSync(
    join(dir, "package.json"),
    `${JSON.stringify(manifest, null, 2)}\n`
  );
  return dir;
}

function commandLine(command: string, args: string[]): string {
  return `${command} ${args.join(" ")}`;
}

async function waitForStaged(name: string): Promise<boolean> {
  for (let attempt = 1; attempt <= 6; attempt++) {
    try {
      const entries = listStagedEntries(name);
      if (
        entries.some(
          (entry) =>
            entry.version === bootstrapVersion && entry.status === "staged"
        )
      ) {
        return true;
      }
    } catch {
      // The package may not be queryable immediately after staging.
    }
    if (attempt < 6) {
      await sleep(1000);
    }
  }
  return false;
}

async function bootstrap(
  packages: WorkspacePackage[],
  config: ReleaseConfig,
  options: BootstrapOptions
): Promise<number> {
  let failures = 0;
  let bootstrapped = 0;

  for (const pkg of packages) {
    console.log(`\n${pkg.name}`);
    const versions = await registryVersions(pkg.name);

    if (versions !== null && realVersions(versions).length > 0) {
      const published = realVersions(versions);
      console.log(
        `  Already published (${published.length} version${published.length === 1 ? "" : "s"}, latest ${published.at(-1)}). Skipping staging.`
      );
      console.log("  If trusted publishing is not configured yet, run:");
      console.log(`    ${commandLine("npm", trustArgs(pkg.name, config))}`);
      continue;
    }

    bootstrapped++;

    if (versions === null) {
      const dir = createBootstrapManifest(pkg, config);
      const args = [
        "stage",
        "publish",
        dir,
        "--access",
        "public",
        "--tag",
        bootstrapTag,
        "--no-provenance",
      ];
      console.log(`  Staging ${bootstrapVersion} from ${displayPath(dir)}...`);
      if (options.dryRun) {
        console.log(`    ${commandLine("npm", args)}`);
      } else {
        const result = runCommand("npm", args);
        if (result.status !== 0) {
          failures++;
          continue;
        }
        if (!(await waitForStaged(pkg.name))) {
          console.warn(
            `  Warning: ${bootstrapVersion} was staged, but it is not visible in npm stage list yet.`
          );
        }
      }
    } else {
      console.log(
        `  Package already exists with bootstrap-only versions (${versions.join(", ")}). Skipping staging.`
      );
    }

    if (!options.trust) {
      console.log("  Trusted publishing was not configured (--no-trust). Run:");
      console.log(`    ${commandLine("npm", trustArgs(pkg.name, config))}`);
      continue;
    }

    if (options.dryRun) {
      console.log(`  ${commandLine("npm", trustArgs(pkg.name, config))}`);
      continue;
    }

    console.log("  Configuring GitHub Actions trusted publishing...");
    const result = runCommand("npm", trustArgs(pkg.name, config));
    if (result.status !== 0) {
      failures++;
      console.error(
        "  Could not configure trusted publishing automatically. Run manually:"
      );
      console.error(`    ${commandLine("npm", trustArgs(pkg.name, config))}`);
    }
  }

  if (bootstrapped === 0) {
    console.log(
      "\nNothing to bootstrap: every specified package already exists on npm."
    );
    return failures === 0 ? 0 : 1;
  }

  console.log("\nNext:");
  console.log("  1. Merge the new package and its changeset.");
  console.log('  2. Run the "Version and Publish" GitHub Actions workflow.');
  console.log(
    "  3. After the real version is published, remove the bootstrap stage:"
  );
  console.log(
    `       pnpm release:cleanup ${packages.map((pkg) => pkg.name).join(" ")}`
  );

  return failures === 0 ? 0 : 1;
}

async function confirm(question: string): Promise<boolean> {
  if (!process.stdin.isTTY) {
    throw new Error(
      "Refusing to run a destructive cleanup without --yes in a non-interactive shell"
    );
  }
  const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  try {
    const answer = await readline.question(`${question} [y/N] `);
    return /^y(es)?$/i.test(answer.trim());
  } finally {
    readline.close();
  }
}

async function confirmOrSkip(
  question: string,
  options: BootstrapOptions
): Promise<boolean> {
  if (options.yes) {
    return true;
  }
  return confirm(question);
}

async function cleanup(
  packages: WorkspacePackage[],
  options: BootstrapOptions
): Promise<number> {
  let failures = 0;

  for (const pkg of packages) {
    console.log(`\n${pkg.name}`);
    const versions = await registryVersions(pkg.name);
    if (versions === null) {
      console.log("  Package does not exist on npm; nothing to clean up.");
      rmSync(bootstrapDir(pkg), { recursive: true, force: true });
      continue;
    }

    if (realVersions(versions).length === 0) {
      failures++;
      console.error(
        "  Refusing to clean up: no real version is published yet.\n" +
          "  Rejecting the only staged version would remove the package and its trusted publisher configuration."
      );
      continue;
    }

    const staged = listStagedEntries(pkg.name).filter(
      (entry) => entry.version === bootstrapVersion
    );
    if (staged.length === 0) {
      console.log(`  No staged ${bootstrapVersion} entry found.`);
    }
    for (const entry of staged) {
      const args = ["stage", "reject", entry.id];
      if (options.dryRun) {
        console.log(`  ${commandLine("npm", args)}`);
        continue;
      }
      if (
        !(await confirmOrSkip(
          `Reject staged ${pkg.name}@${entry.version} (${entry.id})?`,
          options
        ))
      ) {
        console.log("  Skipped.");
        continue;
      }
      const result = runCommand("npm", args);
      if (result.status !== 0) {
        failures++;
      }
    }

    if (options.dryRun) {
      if (versions.includes(stagePlaceholderVersion)) {
        console.log(`  If ${stagePlaceholderVersion} remains after rejection:`);
        console.log(
          `    ${commandLine("npm", ["unpublish", `${pkg.name}@${stagePlaceholderVersion}`, "--force"])}`
        );
      }
    } else {
      // Staged rejection can take a moment to propagate to the registry.
      await sleep(1000);
      const after = await registryVersions(pkg.name);
      if (after?.includes(stagePlaceholderVersion)) {
        const args = [
          "unpublish",
          `${pkg.name}@${stagePlaceholderVersion}`,
          "--force",
        ];
        if (
          await confirmOrSkip(
            `Unpublish placeholder ${pkg.name}@${stagePlaceholderVersion}?`,
            options
          )
        ) {
          const result = runCommand("npm", args);
          if (result.status !== 0) {
            failures++;
            console.error(
              `  Could not remove the placeholder. Run manually:\n    ${commandLine("npm", args)}`
            );
          }
        } else {
          console.log("  Skipped placeholder removal.");
        }
      } else {
        console.log(`  ${stagePlaceholderVersion} placeholder is gone.`);
      }
    }

    rmSync(bootstrapDir(pkg), { recursive: true, force: true });
  }

  return failures === 0 ? 0 : 1;
}

async function main(): Promise<number> {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printUsage();
    return 0;
  }
  if (options.names.length === 0) {
    printUsage();
    throw new Error("Specify at least one package name");
  }

  const packages = selectPackages(options.names);
  if (options.cleanup) {
    return cleanup(packages, options);
  }
  return bootstrap(packages, readReleaseConfig(), options);
}

main()
  .then((exitCode) => {
    process.exitCode = exitCode;
  })
  .catch((error) => {
    console.error(`\n✗ ${errorMessage(error)}`);
    process.exitCode = 1;
  });
