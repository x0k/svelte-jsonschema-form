#!/usr/bin/env node
/**
 * Runs the browser performance cases in `@sjsf/basic-theme` and prints a table.
 *
 * The browser test posts its samples to a local sink because Vitest does not
 * forward browser console output in this setup. This runner owns the sink, the
 * build step, and the summary.
 */

import { spawn, spawnSync } from "node:child_process";
import { createServer } from "node:http";
import { resolve } from "node:path";

const repoRoot = resolve(import.meta.dirname, "../..");
const args = process.argv.slice(2);

function argValue(flag, fallback) {
  const index = args.indexOf(flag);
  return index === -1 ? fallback : args[index + 1];
}

const fields = argValue("--fields", "100,400,1000");
const samples = Number(argValue("--samples", "15"));
const skipBuild = args.includes("--no-build");

function run(command, commandArgs) {
  const result = spawnSync(command, commandArgs, {
    cwd: repoRoot,
    env: process.env,
    stdio: "inherit",
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

if (!skipBuild) {
  run("pnpm", ["--filter", "@sjsf/form", "build"]);
}

const results = [];
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
      results.push(JSON.parse(body));
      response.writeHead(200);
      response.end("ok");
    } catch {
      response.writeHead(400);
      response.end("invalid json");
    }
  });
});

await new Promise((resolvePromise) => {
  server.listen(0, "127.0.0.1", resolvePromise);
});
const url = `http://127.0.0.1:${server.address().port}`;

const child = spawn(
  "pnpm",
  [
    "--filter",
    "@sjsf/basic-theme",
    "exec",
    "vitest",
    "run",
    "--config",
    "vitest.bench.config.ts",
  ],
  {
    cwd: repoRoot,
    stdio: "inherit",
    env: {
      ...process.env,
      VITE_SJSF_BENCH_URL: url,
      VITE_SJSF_BENCH_FIELDS: fields,
      VITE_SJSF_BENCH_SAMPLES: String(samples),
    },
  }
);

const exitCode = await new Promise((resolvePromise) => {
  child.on("exit", (code) => resolvePromise(code ?? 1));
});

server.close();
server.closeAllConnections?.();

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function percentile(values, p) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.ceil(p * sorted.length) - 1)];
}

function format(value) {
  return value.toFixed(2);
}

const order = new Map(
  [
    "branch-swap",
    "dependency-unrelated",
    "plain-unrelated",
    "dependency-nested",
    "dependency-create",
  ].map((name, index) => [name, index])
);

const sorted = [...results].sort(
  (a, b) =>
    (order.get(a.case) ?? Number.MAX_SAFE_INTEGER) -
      (order.get(b.case) ?? Number.MAX_SAFE_INTEGER) || a.fields - b.fields
);

if (sorted.length === 0) {
  console.error("No benchmark results were collected.");
  process.exit(exitCode || 1);
}

console.log("");
console.log(
  "Case                      Fields   Median    p95     Min     Max   Samples"
);
console.log(
  "------------------------  ------   ------   -----   -----   -----   -------"
);
for (const result of sorted) {
  const values = result.samples;
  console.log(
    `${result.case.padEnd(24)}  ${String(result.fields).padStart(6)}   ${format(median(values)).padStart(6)}   ${format(percentile(values, 0.95)).padStart(5)}   ${format(Math.min(...values)).padStart(5)}   ${format(Math.max(...values)).padStart(5)}   ${String(values.length).padStart(7)}`
  );
}
console.log("");
console.log(
  "Times are milliseconds around one command + Svelte flush, in Chromium."
);
console.log("Run on an idle machine and compare runs from the same machine.");

process.exit(exitCode);
