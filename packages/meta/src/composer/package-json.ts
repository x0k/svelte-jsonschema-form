import type { AbstractPackage } from "../package.ts";

export interface PackageJson {
  name: string;
  dependencies: AbstractPackage[];
}

export function buildPackageJson({ name, dependencies: deps }: PackageJson) {
  const dependencies: Record<string, string> = {};
  const devDependencies: Record<string, string> = {};
  for (const d of deps) {
    (d.dev ? devDependencies : dependencies)[d.name] = `^${d.version}`;
  }
  return JSON.stringify(
    {
      name,
      version: "0.0.1",
      type: "module",
      dependencies,
      devDependencies,
      scripts: {
        dev: "vite dev",
      },
    },
    null,
    2,
  );
}
