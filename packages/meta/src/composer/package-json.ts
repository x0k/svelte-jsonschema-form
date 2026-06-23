import type { Language } from "../codegen/model.ts";
import type { AbstractPackage } from "../package.ts";

export interface PackageJson {
  name: string;
  dependencies: Iterable<AbstractPackage>;
  precompiled: boolean;
  language: Language;
}

export function buildPackageJson({
  name,
  dependencies: deps,
  precompiled,
  language,
}: PackageJson) {
  const dependencies: Record<string, string> = {};
  const devDependencies: Record<string, string> = {};
  for (const d of deps) {
    (d.dev ? devDependencies : dependencies)[d.name] = `^${d.version}`;
  }
  const scripts: Record<string, string> = {
    dev: "vite dev",
  };
  if (precompiled) {
    scripts["sjsf:compile"] = `node scripts/compile-validators.${language}`;
    scripts["prepare"] = "npm run sjsf:compile";
  }
  return JSON.stringify(
    {
      name,
      version: "0.0.1",
      type: "module",
      dependencies,
      devDependencies,
      scripts,
    },
    null,
    2
  );
}
