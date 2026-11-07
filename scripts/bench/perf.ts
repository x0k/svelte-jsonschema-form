#!/usr/bin/env node
/**
 * Compares browser performance of the same form benchmark suite between two
 * git refs.
 *
 * Each ref is prepared in an isolated worktree. The benchmark suite from the
 * current checkout is copied into every worktree, so both refs run the same
 * cases. Samples are posted to a local sink because Vitest does not forward
 * browser console output in this setup.
 */

import { spawn, spawnSync, type StdioOptions } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";

interface PerfOptions {
  baseRef: string;
  headRef: string;
  fields: string;
  samples: number;
  asJson: boolean;
  keepWorktrees: boolean;
  skipBuild: boolean;
}

interface PreparedWorktree {
  ref: string;
  sha: string;
  dir: string;
  cleanup: boolean;
}

interface PerfSample {
  case: string;
  fields: number;
  samples: number[];
}

interface PerfRun {
  ref: string;
  sha: string;
  results: PerfSample[];
}

interface Summary {
  median: number;
  p95: number;
  min: number;
  max: number;
  samples: number;
}

interface ComparisonRow {
  case: string;
  fields: number;
  base: Summary | undefined;
  head: Summary | undefined;
  delta: { median: number; percent: number } | undefined;
}

const repoRoot = resolve(import.meta.dirname, "../..");
const suiteSource = join(repoRoot, "packages/basic-theme/tests/benchmarks");
const configSource = join(
  repoRoot,
  "packages/basic-theme/vitest.bench.config.ts"
);

function parseOptions(args: string[]): PerfOptions {
  function argValue(flag: string, fallback: string): string {
    const index = args.indexOf(flag);
    return index === -1 ? fallback : args[index + 1]!;
  }
  return {
    baseRef: argValue("--base", "origin/main"),
    headRef: argValue("--head", "HEAD"),
    fields: argValue("--fields", "100,400,1000"),
    samples: Number(argValue("--samples", "15")),
    asJson: args.includes("--json"),
    keepWorktrees: args.includes("--keep"),
    skipBuild: args.includes("--no-build"),
  };
}

function run(
  command: string,
  commandArgs: string[],
  {
    cwd = repoRoot,
    stdio = "inherit",
  }: { cwd?: string; stdio?: StdioOptions } = {}
): string {
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

function resolveRef(ref: string): string {
  return run("git", ["rev-parse", "--verify", `${ref}^{commit}`], {
    cwd: repoRoot,
    stdio: ["ignore", "pipe", "inherit"],
  }).trim();
}

function prepare(ref: string): PreparedWorktree {
  if (ref === "worktree" || ref === ".") {
    return { ref, sha: resolveRef("HEAD"), dir: repoRoot, cleanup: false };
  }
  const sha = resolveRef(ref);
  const dir = mkdtempSync(join(tmpdir(), "sjsf-perf-"));
  run("git", ["worktree", "add", "--detach", dir, sha], { cwd: repoRoot });
  return { ref, sha, dir, cleanup: true };
}

function install(dir: string): void {
  if (dir === repoRoot && existsSync(join(dir, "node_modules"))) {
    return;
  }
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

function copySuite(dir: string): void {
  if (dir === repoRoot) {
    return;
  }
  const target = join(dir, "packages/basic-theme/tests/benchmarks");
  mkdirSync(dirname(target), { recursive: true });
  cpSync(suiteSource, target, { recursive: true, force: true });
  cpSync(
    configSource,
    join(dir, "packages/basic-theme/vitest.bench.config.ts"),
    { force: true }
  );
}

function build(dir: string, skipBuild: boolean): void {
  if (skipBuild) {
    return;
  }
  run("pnpm", ["--dir", dir, "--filter", "@sjsf/form", "run", "build"]);
  run("pnpm", ["--dir", dir, "--filter", "validator-testing", "run", "build"]);
  run("pnpm", [
    "--dir",
    dir,
    "--filter",
    "@sjsf/ajv8-validator",
    "run",
    "build",
  ]);
  run("pnpm", ["--dir", dir, "--filter", "theme-testing", "run", "build"]);
}

function cleanup(prepared: PreparedWorktree, keepWorktrees: boolean): void {
  if (!prepared.cleanup) {
    return;
  }
  if (keepWorktrees) {
    console.log(`Kept worktree: ${prepared.dir}`);
    return;
  }
  try {
    run("git", ["worktree", "remove", "--force", prepared.dir], {
      cwd: repoRoot,
      stdio: "ignore",
    });
  } catch {
    rmSync(prepared.dir, { recursive: true, force: true });
    run("git", ["worktree", "prune"], { cwd: repoRoot, stdio: "ignore" });
  }
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)]!;
}

function percentile(values: number[], p: number): number {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.ceil(p * sorted.length) - 1)]!;
}

function summarize(result: PerfSample): Summary {
  const values = result.samples;
  return {
    median: median(values),
    p95: percentile(values, 0.95),
    min: Math.min(...values),
    max: Math.max(...values),
    samples: values.length,
  };
}

function resultKey(result: PerfSample): string {
  return `${result.case}\0${result.fields}`;
}

function sortResults(results: PerfSample[]): PerfSample[] {
  return [...results].sort(
    (a, b) => a.case.localeCompare(b.case) || a.fields - b.fields
  );
}

function formatMs(value: number): string {
  return value.toFixed(2);
}

function formatDelta(base: number, head: number): string {
  const delta = head - base;
  const percent = base === 0 ? 0 : (delta / base) * 100;
  const sign = delta >= 0 ? "+" : "";
  return `${sign}${formatMs(delta)} (${sign}${percent.toFixed(1)}%)`;
}

function printRun(label: string, run: PerfRun): void {
  console.log("");
  console.log(`${label}: ${run.ref} (${run.sha.slice(0, 9)})`);
  console.log("");
  console.log(
    "Case                      Fields   Median    p95     Min     Max   Samples"
  );
  console.log(
    "------------------------  ------   ------   -----   -----   -----   -------"
  );
  for (const result of sortResults(run.results)) {
    const summary = summarize(result);
    console.log(
      `${result.case.padEnd(24)}  ${String(result.fields).padStart(6)}   ${formatMs(summary.median).padStart(6)}   ${formatMs(summary.p95).padStart(5)}   ${formatMs(summary.min).padStart(5)}   ${formatMs(summary.max).padStart(5)}   ${String(summary.samples).padStart(7)}`
    );
  }
}

function compare(
  baseResults: PerfSample[],
  headResults: PerfSample[]
): ComparisonRow[] {
  const baseByKey = new Map(baseResults.map((r) => [resultKey(r), r]));
  const headByKey = new Map(headResults.map((r) => [resultKey(r), r]));
  const keys = new Set([...baseByKey.keys(), ...headByKey.keys()]);
  const rows: ComparisonRow[] = [];
  for (const key of keys) {
    const base = baseByKey.get(key);
    const head = headByKey.get(key);
    const sample = base ?? head;
    if (sample === undefined) {
      continue;
    }
    const baseSummary = base ? summarize(base) : undefined;
    const headSummary = head ? summarize(head) : undefined;
    rows.push({
      case: sample.case,
      fields: sample.fields,
      base: baseSummary,
      head: headSummary,
      delta:
        baseSummary && headSummary
          ? {
              median: headSummary.median - baseSummary.median,
              percent:
                baseSummary.median === 0
                  ? 0
                  : ((headSummary.median - baseSummary.median) /
                      baseSummary.median) *
                    100,
            }
          : undefined,
    });
  }
  return rows.sort(
    (a, b) => a.case.localeCompare(b.case) || a.fields - b.fields
  );
}

function printComparison(
  baseLabel: string,
  base: PerfRun,
  headLabel: string,
  head: PerfRun,
  rows: ComparisonRow[]
): void {
  console.log("");
  console.log(
    `Comparison: ${baseLabel} (${base.ref} @ ${base.sha.slice(0, 9)}) -> ${headLabel} (${head.ref} @ ${head.sha.slice(0, 9)})`
  );
  console.log("");
  console.log(
    "Case                      Fields   Base med   Head med   Delta          Base p95   Head p95"
  );
  console.log(
    "------------------------  ------   --------   --------   ------------   --------   --------"
  );
  for (const row of rows) {
    const baseMedian = row.base
      ? formatMs(row.base.median).padStart(8)
      : "     n/a";
    const headMedian = row.head
      ? formatMs(row.head.median).padStart(8)
      : "     n/a";
    const delta = row.delta
      ? formatDelta(row.base!.median, row.head!.median).padEnd(12)
      : "n/a         ";
    const baseP95 = row.base ? formatMs(row.base.p95).padStart(8) : "     n/a";
    const headP95 = row.head ? formatMs(row.head.p95).padStart(8) : "     n/a";
    console.log(
      `${row.case.padEnd(24)}  ${String(row.fields).padStart(6)}   ${baseMedian}   ${headMedian}   ${delta}   ${baseP95}   ${headP95}`
    );
  }
}

export async function main(): Promise<void> {
  const options = parseOptions(process.argv.slice(2));
  const resultsByRef = new Map<string, PerfSample[]>();
  let currentRef = "";

  const server = createServer((request, response) => {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "content-type");
    if (request.method === "OPTIONS") {
      response.writeHead(204);
      response.end();
      return;
    }
    if (request.method !== "POST") {
      response.writeHead(405);
      response.end();
      return;
    }
    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => (body += chunk));
    request.on("end", () => {
      try {
        const result = JSON.parse(body) as PerfSample;
        resultsByRef.get(currentRef)?.push(result);
        response.writeHead(200);
        response.end("ok");
      } catch {
        response.writeHead(400);
        response.end("invalid json");
      }
    });
  });

  await new Promise<void>((resolvePromise) => {
    server.listen(0, "127.0.0.1", resolvePromise);
  });
  const address = server.address();
  if (address === null || typeof address === "string") {
    throw new Error("Failed to start the benchmark result sink");
  }
  const sinkUrl = `http://127.0.0.1:${address.port}`;

  async function measureRef(ref: string): Promise<PerfRun> {
    const prepared = prepare(ref);
    try {
      install(prepared.dir);
      copySuite(prepared.dir);
      build(prepared.dir, options.skipBuild);
      resultsByRef.set(ref, []);
      currentRef = ref;
      const child = spawn(
        "pnpm",
        [
          "--dir",
          prepared.dir,
          "--filter",
          "@sjsf/basic-theme",
          "exec",
          "vitest",
          "run",
          "--config",
          "vitest.bench.config.ts",
        ],
        {
          cwd: prepared.dir,
          stdio: "inherit",
          env: {
            ...process.env,
            VITE_SJSF_BENCH_URL: sinkUrl,
            VITE_SJSF_BENCH_FIELDS: options.fields,
            VITE_SJSF_BENCH_SAMPLES: String(options.samples),
          },
        }
      );
      const exitCode = await new Promise<number>((resolvePromise) => {
        child.on("exit", (code) => resolvePromise(code ?? 1));
      });
      if (exitCode !== 0) {
        throw new Error(`Benchmark failed for ${ref} (exit code ${exitCode})`);
      }
      const results = resultsByRef.get(ref);
      if (results === undefined) {
        throw new Error(`No results were collected for ${ref}`);
      }
      return { ref, sha: prepared.sha, results };
    } finally {
      cleanup(prepared, options.keepWorktrees);
    }
  }

  let base: PerfRun | undefined;
  let head: PerfRun | undefined;
  try {
    base = await measureRef(options.baseRef);
    head = await measureRef(options.headRef);
  } finally {
    server.close();
    server.closeAllConnections?.();
  }

  if (base === undefined || head === undefined) {
    console.error("No benchmark results were collected.");
    process.exitCode = 1;
    return;
  }

  if (base.results.length === 0 || head.results.length === 0) {
    console.error("No benchmark results were collected.");
    process.exitCode = 1;
    return;
  }

  const comparison = compare(base.results, head.results);

  if (options.asJson) {
    console.log(
      JSON.stringify(
        {
          base: {
            ref: base.ref,
            sha: base.sha,
            results: sortResults(base.results).map((result) => ({
              ...result,
              summary: summarize(result),
            })),
          },
          head: {
            ref: head.ref,
            sha: head.sha,
            results: sortResults(head.results).map((result) => ({
              ...result,
              summary: summarize(result),
            })),
          },
          comparison,
        },
        null,
        2
      )
    );
  } else {
    printRun("Base", base);
    printRun("Head", head);
    printComparison("Base", base, "Head", head, comparison);
    console.log("");
    console.log(
      "Times are milliseconds around one DOM update (or form creation) plus a Svelte flush, in Chromium."
    );
    console.log(
      "Run on an idle machine and compare runs from the same machine; absolute numbers are not portable."
    );
  }
}

if (import.meta.main) {
  await main();
}
