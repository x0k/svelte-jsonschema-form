import fs from "node:fs";
import path from "node:path";

export type FsSnapshot = Record<string, string>;

export type SnapshotFsOptions = {
  exclude?: Set<string>;
  excludeExtensions?: Set<string>;
  filter?: (relativePath: string) => boolean;
};

const DEFAULT_EXCLUDE = new Set([
  "node_modules",
  ".git",
  ".svelte-kit",
  ".gitignore",
  ".npmrc",
  ".vscode",
  "README.md",
  "public",
  "static",
  "tsconfig.json",
  "tsconfig.app.json",
  "tsconfig.node.json",
]);
const DEFAULT_EXCLUDE_EXT = new Set([".lock"]);

export function snapshotFs(
  dir: string,
  {
    exclude = DEFAULT_EXCLUDE,
    excludeExtensions = DEFAULT_EXCLUDE_EXT,
    filter,
  }: SnapshotFsOptions = {},
  _root = dir,
): FsSnapshot {
  const excludeSet = new Set(exclude);
  const excludeExtSet = new Set(excludeExtensions);

  const result: FsSnapshot = {};

  function walk(current: string): void {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      if (excludeSet.has(entry.name)) continue;

      const fullPath = path.join(current, entry.name);
      const relativePath = path.relative(_root, fullPath);

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile()) {
        if (excludeExtSet.has(path.extname(entry.name))) continue;
        if (filter && !filter(relativePath)) continue;
        result[relativePath] = fs.readFileSync(fullPath, "utf8");
      }
    }
  }

  walk(dir);

  return Object.fromEntries(
    Object.entries(result).sort(([a], [b]) => a.localeCompare(b)),
  );
}
