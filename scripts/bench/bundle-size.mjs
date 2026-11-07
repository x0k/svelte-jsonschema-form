#!/usr/bin/env node
/**
 * Compares the minified and gzipped size of the `@sjsf/form` entry and a small
 * `@sjsf/basic-theme` app between two git refs.
 *
 * Each ref is built in an isolated worktree so the current checkout is never
 * modified. Workspace packages are linked into the bundle fixture's
 * `node_modules`, which lets Vite resolve their real `exports` maps.
 */

import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  symlinkSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { gzipSync } from "node:zlib";

const repoRoot = resolve(import.meta.dirname, "../..");
const fixtureSource = join(repoRoot, "scripts/bench/bundle-fixture");

function parseOptions(args) {
  function argValue(flag, fallback) {
    const index = args.indexOf(flag);
    return index === -1 ? fallback : args[index + 1];
  }
  return {
    baseRef: argValue("--base", "origin/main"),
    headRef: argValue("--head", "HEAD"),
    asJson: args.includes("--json"),
    keepWorktrees: args.includes("--keep"),
  };
}

function run(command, commandArgs, { cwd, stdio = "inherit" } = {}) {
  const result = spawnSync(command, commandArgs, {
    cwd,
    env: process.env,
    stdio,
  });
  if (result.status !== 0) {
    throw new Error(
      `Command failed (${result.status}): ${command} ${commandArgs.join(" ")}`
    );
  }
  return result.stdout?.toString() ?? "";
}

function resolveRef(ref) {
  return run("git", ["rev-parse", "--verify", `${ref}^{commit}`], {
    cwd: repoRoot,
    stdio: ["ignore", "pipe", "inherit"],
  }).trim();
}

function prepare(ref) {
  if (ref === "worktree" || ref === ".") {
    return { ref, sha: resolveRef("HEAD"), dir: repoRoot, cleanup: false };
  }
  const sha = resolveRef(ref);
  const dir = mkdtempSync(join(tmpdir(), "sjsf-bundle-"));
  run("git", ["worktree", "add", "--detach", dir, sha], { cwd: repoRoot });
  return { ref, sha, dir, cleanup: true };
}

function install(dir) {
  const installArgs = [
    "install",
    "--dir",
    dir,
    "--frozen-lockfile",
    "--ignore-scripts",
  ];
  try {
    run("pnpm", [...installArgs, "--offline"]);
  } catch {
    console.warn("Offline install failed, retrying with registry access...");
    run("pnpm", installArgs);
  }
}

function copyFixture(dir) {
  const target = join(dir, "scripts/bench/bundle-fixture");
  if (target !== fixtureSource) {
    cpSync(fixtureSource, target, {
      recursive: true,
      filter(source) {
        return !source.includes("node_modules") && !source.includes("dist-");
      },
    });
  }
  const nodeModules = join(target, "node_modules");
  const sjsf = join(nodeModules, "@sjsf");
  rmSync(nodeModules, { recursive: true, force: true });
  mkdirSync(sjsf, { recursive: true });
  symlinkSync(join(dir, "packages/form"), join(sjsf, "form"), "dir");
  symlinkSync(
    join(dir, "packages/basic-theme"),
    join(sjsf, "basic-theme"),
    "dir"
  );
  return target;
}

function buildPackages(dir) {
  run("pnpm", ["--dir", dir, "--filter", "@sjsf/form", "run", "build"]);
  run("pnpm", ["--dir", dir, "--filter", "@sjsf/basic-theme", "run", "build"]);
}

function buildEntry(dir, entry) {
  run(
    "pnpm",
    [
      "--dir",
      dir,
      "exec",
      "vite",
      "build",
      "--config",
      `scripts/bench/bundle-fixture/vite.${entry}.config.mjs`,
    ],
    { cwd: dir }
  );
}

function measure(dir, entry) {
  const assets = join(
    dir,
    "scripts/bench/bundle-fixture",
    `dist-${entry}`,
    "assets"
  );
  const files = readdirSync(assets).filter((file) => file.endsWith(".js"));
  let raw = 0;
  let gzip = 0;
  for (const file of files) {
    const content = readFileSync(join(assets, file));
    raw += statSync(join(assets, file)).size;
    gzip += gzipSync(content).length;
  }
  return { files, raw, gzip };
}

function measureRef(ref, keepWorktrees) {
  const prepared = prepare(ref);
  try {
    if (prepared.dir === repoRoot) {
      if (!existsSync(join(repoRoot, "node_modules"))) {
        install(repoRoot);
      }
    } else {
      install(prepared.dir);
    }
    copyFixture(prepared.dir);
    buildPackages(prepared.dir);
    const result = { ref, sha: prepared.sha };
    for (const entry of ["form", "app"]) {
      buildEntry(prepared.dir, entry);
      result[entry] = measure(prepared.dir, entry);
    }
    return result;
  } finally {
    if (prepared.cleanup && !keepWorktrees) {
      try {
        run("git", ["worktree", "remove", "--force", prepared.dir], {
          cwd: repoRoot,
          stdio: "ignore",
        });
      } catch {
        rmSync(prepared.dir, { recursive: true, force: true });
        run("git", ["worktree", "prune"], { cwd: repoRoot, stdio: "ignore" });
      }
    } else if (prepared.cleanup) {
      console.log(`Kept worktree: ${prepared.dir}`);
    }
  }
}

function formatBytes(bytes) {
  return `${(bytes / 1000).toFixed(2)} kB`;
}

function formatDelta(base, head) {
  const delta = head - base;
  const percent = base === 0 ? 0 : (delta / base) * 100;
  const sign = delta >= 0 ? "+" : "";
  return `${sign}${formatBytes(delta)} (${sign}${percent.toFixed(1)}%)`;
}

export function main() {
  const options = parseOptions(process.argv.slice(2));
  const base = measureRef(options.baseRef, options.keepWorktrees);
  const head = measureRef(options.headRef, options.keepWorktrees);

  if (options.asJson) {
    console.log(
      JSON.stringify(
        {
          base,
          head,
          delta: {
            form: {
              raw: head.form.raw - base.form.raw,
              gzip: head.form.gzip - base.form.gzip,
            },
            app: {
              raw: head.app.raw - base.app.raw,
              gzip: head.app.gzip - base.app.gzip,
            },
          },
        },
        null,
        2
      )
    );
  } else {
    console.log("");
    console.log("Bundle size (JS assets, esbuild minify)");
    console.log("");
    console.log(
      "Entry   Base                       Head                       Delta"
    );
    console.log(
      "-----   ------------------------   ------------------------   ------------------------------"
    );
    for (const entry of ["form", "app"]) {
      const b = base[entry];
      const h = head[entry];
      console.log(
        `${entry.padEnd(7)} ${`${formatBytes(b.raw)} / ${formatBytes(b.gzip)} gzip`.padEnd(24)}   ${`${formatBytes(h.raw)} / ${formatBytes(h.gzip)} gzip`.padEnd(24)}   ${formatDelta(b.raw, h.raw)} / ${formatDelta(b.gzip, h.gzip)} gzip`
      );
    }
    console.log("");
    console.log(`Base: ${base.ref} (${base.sha.slice(0, 9)})`);
    console.log(`Head: ${head.ref} (${head.sha.slice(0, 9)})`);
    console.log(
      "The form entry externalizes Svelte; the app entry bundles Svelte and the basic theme."
    );
  }
}

if (import.meta.main) {
  main();
}
