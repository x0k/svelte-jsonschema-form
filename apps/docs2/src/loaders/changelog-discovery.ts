import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT_DIRS = ["packages", "legacy", "lab", "apps"];

export interface ChangelogEntry {
  id: string;
  title: string;
  filePath: string;
}

export interface ChangelogSlug {
  slug: string;
  label: string;
}

function* scanPackages(root: string) {
  for (const dir of ROOT_DIRS) {
    const base = join(root, dir);
    if (!existsSync(base)) continue;
    for (const name of readdirSync(base)) {
      const pkgPath = join(base, name, "package.json");
      const clPath = join(base, name, "CHANGELOG.md");
      if (!existsSync(pkgPath) || !existsSync(clPath)) continue;
      const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
      if (pkg.private && dir !== "apps") continue;
      yield { name, pkg, clPath };
    }
  }
}

export function discoverChangelogs(root: string): ChangelogEntry[] {
  return Array.from(scanPackages(root), ({ name, pkg, clPath }) => ({
    id: `changelogs/${name}`,
    title: pkg.name,
    filePath: relative(root, clPath),
  }));
}

export function discoverChangelogSlugs(root: string): ChangelogSlug[] {
  return Array.from(scanPackages(root), ({ name, pkg }) => ({
    slug: `changelogs/${name}`,
    label: pkg.name,
  }));
}
