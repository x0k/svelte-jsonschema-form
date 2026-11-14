#!/usr/bin/env node
/**
 * Bootstraps npm trusted publishing for packages that do not exist yet.
 *
 * npm trusted publishers require an existing package. Staging a throwaway
 * `0.0.0-bootstrap` version reserves the name and lets `npm trust github`
 * configure the OIDC publisher. The real release can then be published by the
 * GitHub Actions workflow.
 *
 * A trusted publisher must complete its first publish within two days of being
 * created, otherwise it expires and has to be recreated. Bootstrap immediately
 * before the first release.
 *
 * Staging and trust setup require an authenticated npm session. 2FA prompts
 * are intentionally left interactive; everything else is automated.
 */

import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createInterface } from "node:readline/promises";

import {
  assertNpmVersion,
  bootstrapDir,
  bootstrapTag,
  bootstrapVersion,
  displayPath,
  errorMessage,
  listStagedEntries,
  minimumNpmVersion,
  readReleaseConfig,
  realVersions,
  registryArgs,
  registryInfo,
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
  trustExplicit: boolean;
  yes: boolean;
  help: boolean;
  names: string[];
}

function parseArgs(args: string[]): BootstrapOptions {
  const options: BootstrapOptions = {
    cleanup: false,
    dryRun: false,
    trust: true,
    trustExplicit: false,
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
      options.trustExplicit = true;
    } else if (arg === "--trust") {
      options.trust = true;
      options.trustExplicit = true;
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
  pnpm release:bootstrap [--dry-run] [--no-trust|--trust] <package...>
  pnpm release:cleanup [--dry-run] [--yes] <package...>

Bootstraps a new package so npm trusted publishing can release it:
  1. Stages a throwaway ${bootstrapVersion} version (creates the package name).
  2. Configures the GitHub Actions trusted publisher.
  3. Prints the release and cleanup steps.

The trusted publisher must complete its first publish within two days or it
expires and has to be recreated. Bootstrap shortly before the first release.

Cleanup rejects the staged bootstrap entry after a real version is published.

Requires npm ${minimumNpmVersion} or newer.

Options:
  --cleanup   Reject staged bootstrap entries instead of creating them
  --dry-run   Print commands without creating or removing files
  --no-trust  Only stage the package; print the npm trust command
  --trust     Also configure trusted publishing for published packages
  --yes, -y   Skip cleanup confirmation prompts (required in non-TTY shells)
  --help      Show this help
`);
}

function createBootstrapManifest(
  pkg: WorkspacePackage,
  config: ReleaseConfig
): void {
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
            entry.version === bootstrapVersion &&
            (entry.status === "staged" || entry.status === "validating")
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
  let processed = 0;
  const cleanupNames: string[] = [];

  for (const pkg of packages) {
    console.log(`\n${pkg.name}`);
    const info = await registryInfo(pkg.name);
    const versions = info?.versions ?? null;
    const published = versions === null ? [] : realVersions(versions);

    if (published.length > 0) {
      const latest =
        info?.latest && published.includes(info.latest)
          ? info.latest
          : published.at(-1);
      console.log(
        `  Already published (${published.length} version${published.length === 1 ? "" : "s"}, latest ${latest}). Skipping staging.`
      );
      if (!options.trust || !options.trustExplicit) {
        console.log("  If trusted publishing is not configured yet, run:");
        console.log(`    ${commandLine("npm", trustArgs(pkg.name, config))}`);
        continue;
      }
      console.log(
        "  Configuring trusted publishing for the existing package..."
      );
      processed++;
    } else {
      processed++;
      cleanupNames.push(pkg.name);
      if (versions === null) {
        const dir = bootstrapDir(pkg);
        const args = [
          "stage",
          "publish",
          dir,
          "--access",
          "public",
          "--tag",
          bootstrapTag,
          "--no-provenance",
          ...registryArgs(),
        ];
        console.log(
          `  Staging ${bootstrapVersion} from ${displayPath(dir)}...`
        );
        if (options.dryRun) {
          console.log(`    ${commandLine("npm", args)}`);
          console.log("    (the manifest is created before staging)");
        } else {
          createBootstrapManifest(pkg, config);
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
    } else {
      console.log(
        "  Note: this trusted publisher must complete its first publish within 2 days or it expires."
      );
    }
  }

  if (processed === 0) {
    console.log(
      "\nNothing to bootstrap: every specified package already exists on npm."
    );
    return failures === 0 ? 0 : 1;
  }

  console.log("\nNext:");
  if (cleanupNames.length === 0) {
    console.log(
      "  Trusted publishing is configured; the next release can be published by"
    );
    console.log('  the "Version and Publish" workflow.');
    return failures === 0 ? 0 : 1;
  }
  console.log("  1. Merge the new package and its changeset.");
  console.log(
    '  2. Land the first release within 2 days: run the "Version and Publish"'
  );
  console.log(
    "     GitHub Actions workflow. Otherwise the trusted publisher expires and"
  );
  console.log("     must be recreated.");
  console.log(
    "  3. After the real version is published, remove the bootstrap stage:"
  );
  console.log(`       pnpm release:cleanup ${cleanupNames.join(" ")}`);

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

interface RemovalOutcome {
  skipped: boolean;
  failed: boolean;
}

async function unpublishVersion(
  pkg: WorkspacePackage,
  version: string,
  label: string,
  options: BootstrapOptions
): Promise<RemovalOutcome> {
  const args = [
    "unpublish",
    `${pkg.name}@${version}`,
    "--force",
    ...registryArgs(),
  ];
  if (
    !(await confirmOrSkip(
      `Unpublish ${label} ${pkg.name}@${version}?`,
      options
    ))
  ) {
    console.log(`  Skipped ${label} removal.`);
    return { skipped: true, failed: false };
  }
  const result = runCommand("npm", args);
  if (result.status !== 0) {
    console.error(
      `  Could not remove the ${label}. Run manually:\n    ${commandLine("npm", args)}`
    );
    return { skipped: false, failed: true };
  }
  console.log(`  Removed ${label} ${pkg.name}@${version}.`);
  return { skipped: false, failed: false };
}

async function removeBootstrapArtifacts(
  pkg: WorkspacePackage,
  options: BootstrapOptions
): Promise<RemovalOutcome> {
  // Staged rejection can take a moment to propagate to the registry.
  await sleep(1000);
  const info = await registryInfo(pkg.name);
  if (info === null) {
    console.warn(
      "  Package is no longer visible on the registry; skipping placeholder removal."
    );
    return { skipped: true, failed: false };
  }

  const outcome: RemovalOutcome = { skipped: false, failed: false };
  const targets = [
    { version: stagePlaceholderVersion, label: "placeholder" },
    { version: bootstrapVersion, label: "approved bootstrap version" },
  ];
  for (const target of targets) {
    if (!info.versions.includes(target.version)) {
      if (target.version === stagePlaceholderVersion) {
        console.log(`  ${stagePlaceholderVersion} placeholder is gone.`);
      }
      continue;
    }
    const result = await unpublishVersion(
      pkg,
      target.version,
      target.label,
      options
    );
    outcome.skipped ||= result.skipped;
    outcome.failed ||= result.failed;
  }
  return outcome;
}

async function cleanup(
  packages: WorkspacePackage[],
  options: BootstrapOptions
): Promise<number> {
  let failures = 0;

  for (const pkg of packages) {
    console.log(`\n${pkg.name}`);
    const info = await registryInfo(pkg.name);
    if (info === null) {
      console.log("  Package does not exist on npm; nothing to clean up.");
      if (!options.dryRun) {
        rmSync(bootstrapDir(pkg), { recursive: true, force: true });
      }
      continue;
    }

    if (realVersions(info.versions).length === 0) {
      failures++;
      console.error(
        "  Refusing to clean up: no real version is published yet.\n" +
          `  Removing the ${stagePlaceholderVersion} placeholder while it is the only published version\n` +
          "  would remove the package and its trusted publisher configuration."
      );
      continue;
    }

    const staged = listStagedEntries(pkg.name).filter(
      (entry) => entry.version === bootstrapVersion
    );
    if (staged.length === 0) {
      console.log(`  No staged ${bootstrapVersion} entry found.`);
    }

    if (options.dryRun) {
      for (const entry of staged) {
        console.log(
          `  ${commandLine("npm", ["stage", "reject", entry.id, ...registryArgs()])}`
        );
      }
      for (const version of [stagePlaceholderVersion, bootstrapVersion]) {
        if (info.versions.includes(version)) {
          console.log(`  If ${version} remains after rejection:`);
          console.log(
            `    ${commandLine("npm", ["unpublish", `${pkg.name}@${version}`, "--force", ...registryArgs()])}`
          );
        }
      }
      continue;
    }

    let completed = true;
    for (const entry of staged) {
      const args = ["stage", "reject", entry.id, ...registryArgs()];
      if (
        !(await confirmOrSkip(
          `Reject staged ${pkg.name}@${entry.version} (${entry.id})?`,
          options
        ))
      ) {
        console.log("  Skipped.");
        completed = false;
        continue;
      }
      const result = runCommand("npm", args);
      if (result.status !== 0) {
        failures++;
        completed = false;
      }
    }

    const outcome = await removeBootstrapArtifacts(pkg, options);
    if (outcome.skipped) {
      completed = false;
    }
    if (outcome.failed) {
      failures++;
      completed = false;
    }

    if (completed) {
      rmSync(bootstrapDir(pkg), { recursive: true, force: true });
    }
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
  assertNpmVersion(minimumNpmVersion, "These release scripts");
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
