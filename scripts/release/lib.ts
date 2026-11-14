/**
 * Shared helpers for release-time npm registry checks.
 *
 * Kept dependency-free so the scripts can run before `pnpm install`.
 */

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";

export interface WorkspacePackage {
  name: string;
  version: string;
  dir: string;
  private: boolean;
}

export interface ReleaseConfig {
  repo: string;
  workflowFile: string;
}

export interface StageEntry {
  id: string;
  packageName: string;
  version: string;
  tag: string;
  status: string;
}

export interface RegistryInfo {
  versions: string[];
  latest: string | null;
}

export const repoRoot = resolve(import.meta.dirname, "../..");
export const defaultRegistry = "https://registry.npmjs.org/";
export const bootstrapVersion = "0.0.0-bootstrap";
export const bootstrapTag = "bootstrap";
export const stagePlaceholderVersion = "0.0.0-stage";
export const releaseWorkflowFile = "version-and-publish.yaml";
export const minimumNpmVersion = "11.15.0";

export function readReleaseConfig(): ReleaseConfig {
  const path = join(repoRoot, ".changeset/config.json");
  const config = JSON.parse(readFileSync(path, "utf8")) as {
    changelog?: [string, { repo?: string }];
  };
  const repo = config.changelog?.[1]?.repo;
  if (!repo) {
    throw new Error(`Could not find the changelog repository in ${path}`);
  }
  return { repo, workflowFile: releaseWorkflowFile };
}

/**
 * Resolves the registry the same way npm does (`.npmrc`, env vars) so reads
 * and writes always target the same place. Falls back to the public registry.
 */
export function registryUrl(): string {
  if (cachedRegistry !== null) {
    return cachedRegistry;
  }
  const registry =
    environmentRegistry() ?? npmConfigRegistry() ?? defaultRegistry;
  cachedRegistry = registry.endsWith("/") ? registry : `${registry}/`;
  return cachedRegistry;
}

let cachedRegistry: string | null = null;

function environmentRegistry(): string | undefined {
  const registry =
    process.env.npm_config_registry ?? process.env.NPM_CONFIG_REGISTRY;
  const trimmed = registry?.trim();
  return trimmed ? trimmed : undefined;
}

function npmConfigRegistry(): string | undefined {
  try {
    const result = runCommand("npm", ["config", "get", "registry"], {
      capture: true,
    });
    return result.status === 0 ? result.stdout.trim() || undefined : undefined;
  } catch {
    return undefined;
  }
}

export function registryArgs(): string[] {
  return ["--registry", registryUrl()];
}

export function assertNpmVersion(required: string, feature: string): void {
  const result = runCommand("npm", ["--version"], { capture: true });
  const version = result.stdout.trim();
  if (result.status !== 0 || !version) {
    throw new Error(
      `Could not determine the npm version (needed for ${feature})`
    );
  }
  if (compareVersions(version, required) < 0) {
    throw new Error(
      `${feature} need npm ${required} or newer (found ${version}). ` +
        "Update npm (Node 26 bundles a recent version) and try again."
    );
  }
}

function compareVersions(a: string, b: string): number {
  const parse = (version: string) =>
    version.split(".").map((part) => Number.parseInt(part, 10) || 0);
  const partsA = parse(a);
  const partsB = parse(b);
  for (let index = 0; index < Math.max(partsA.length, partsB.length); index++) {
    const diff = (partsA[index] ?? 0) - (partsB[index] ?? 0);
    if (diff !== 0) {
      return diff;
    }
  }
  return 0;
}

export function listWorkspacePackages(): WorkspacePackage[] {
  const result = spawnSync("pnpm", ["list", "-r", "--depth", "-1", "--json"], {
    cwd: repoRoot,
    encoding: "utf8",
    env: { ...process.env, NO_COLOR: "1", FORCE_COLOR: "0" },
    maxBuffer: 20 * 1024 * 1024,
  });
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(
      `pnpm list failed (${result.status}): ${result.stderr || result.stdout}`
    );
  }
  const projects = JSON.parse(result.stdout) as Array<{
    name?: string;
    version?: string;
    path: string;
    private?: boolean;
  }>;
  return projects.flatMap((project) => {
    if (!project.name) {
      return [];
    }
    return [
      {
        name: project.name,
        version: project.version ?? "0.0.0",
        dir: project.path,
        private: project.private === true,
      },
    ];
  });
}

export function publishablePackages(): WorkspacePackage[] {
  return listWorkspacePackages().filter((pkg) => !pkg.private);
}

export function selectPackages(names: string[]): WorkspacePackage[] {
  const uniqueNames = [...new Set(names)];
  if (uniqueNames.length === 0) {
    return publishablePackages();
  }
  const byName = new Map(listWorkspacePackages().map((pkg) => [pkg.name, pkg]));
  return uniqueNames.map((name) => {
    const pkg = byName.get(name);
    if (!pkg) {
      throw new Error(`Package ${name} is not a workspace package`);
    }
    if (pkg.private) {
      throw new Error(`Package ${name} is private and cannot be published`);
    }
    return pkg;
  });
}

export function displayPath(dir: string): string {
  return relative(repoRoot, dir).split("\\").join("/");
}

export function bootstrapDir(pkg: WorkspacePackage): string {
  const directoryName = pkg.name.replace(/^@/, "").replace(/[/\\]/g, "__");
  return join(repoRoot, ".tmp/release-bootstrap", directoryName);
}

export function isBootstrapVersion(version: string): boolean {
  return version === bootstrapVersion || version === stagePlaceholderVersion;
}

export function realVersions(versions: string[]): string[] {
  return versions.filter((version) => !isBootstrapVersion(version));
}

export async function registryInfo(
  name: string,
  registry = registryUrl()
): Promise<RegistryInfo | null> {
  const url = `${registry}${encodeURIComponent(name)}`;
  let lastError: unknown;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, {
        headers: { accept: "application/json" },
        signal: AbortSignal.timeout(15_000),
      });
      if (response.status === 404) {
        return null;
      }
      if (!response.ok) {
        throw new Error(`GET ${url} returned HTTP ${response.status}`);
      }
      const body = (await response.json()) as {
        versions?: Record<string, unknown>;
        "dist-tags"?: { latest?: unknown };
      };
      const latest = body["dist-tags"]?.latest;
      return {
        versions: Object.keys(body.versions ?? {}),
        latest: typeof latest === "string" ? latest : null,
      };
    } catch (error) {
      lastError = error;
      if (attempt < 3) {
        await sleep(500 * 2 ** (attempt - 1));
      }
    }
  }
  throw new Error(`Could not query ${name}: ${errorMessage(lastError)}`);
}

export function listStagedEntries(name: string): StageEntry[] {
  const result = runCommand(
    "npm",
    ["stage", "list", name, "--json", ...registryArgs()],
    { capture: true }
  );
  if (result.status !== 0) {
    throw new Error(
      `npm stage list ${name} failed (${result.status}): ${result.stderr.trim()}`
    );
  }
  const output = result.stdout.trim();
  if (!output) {
    return [];
  }
  return JSON.parse(output) as StageEntry[];
}

export function trustArgs(pkg: string, config: ReleaseConfig): string[] {
  return [
    "trust",
    "github",
    pkg,
    "--repo",
    config.repo,
    "--file",
    config.workflowFile,
    "--allow-publish",
    "--yes",
    ...registryArgs(),
  ];
}

export function runCommand(
  command: string,
  args: string[],
  options: { capture?: boolean; cwd?: string } = {}
): { status: number; stdout: string; stderr: string } {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? repoRoot,
    encoding: "utf8",
    env: { ...process.env, NO_COLOR: "1", FORCE_COLOR: "0" },
    stdio: options.capture ? ["ignore", "pipe", "pipe"] : "inherit",
    maxBuffer: 20 * 1024 * 1024,
  });
  if (result.error) {
    throw result.error;
  }
  return {
    status: result.status ?? 1,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
  };
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
