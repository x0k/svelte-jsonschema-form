import type { StarlightIcon } from "@astrojs/starlight/types";
import {
  externalValidatorPackage,
  filterPackageDependencies,
  formPackage,
  isInternalValidator,
  isLabTheme,
  isLegacyTheme,
  isSubTheme,
  isTheme,
  isThemeExtension,
  isValidator,
  optionalPackageName,
  sveltekitPackage,
  themePackage,
  themeParent,
  themes,
  type Generated,
  type Package,
} from "meta";

export function* actualThemes() {
  for (const t of themes()) {
    if (isLegacyTheme(t) || isThemeExtension(t) || isLabTheme(t)) {
      continue;
    }
    yield t;
  }
}

export type ActualTheme = Generated<typeof actualThemes>;

export const PKG_MANGERS = ["npm", "pnpm", "yarn", "bun", "deno"] as const;

export type PackageManager = (typeof PKG_MANGERS)[number];

export const PKG_MANGER_ICONS: Record<PackageManager, StarlightIcon> = {
  npm: "seti:npm",
  yarn: "seti:yarn",
  pnpm: "pnpm",
  bun: "bun",
  deno: "deno",
};

function getPackageByCodeName(n: string) {
  switch (true) {
    case n === "form":
      return formPackage;
    case n === "sveltekit":
      return sveltekitPackage;
    case isTheme(n):
      return themePackage(n);
    case isSubTheme(n):
      return themePackage(themeParent(n));
    case isValidator(n):
      return isInternalValidator(n) ? formPackage : externalValidatorPackage(n);
  }
}

export function isValidPackageCodeName(name: string) {
  return getPackageByCodeName(name) !== undefined;
}

export function getPackageMetadataByCodeName(pkgCodeName: string) {
  const pkg = getPackageByCodeName(pkgCodeName);
  if (!pkg) {
    throw new Error(`Unknown package: "${pkgCodeName}"`);
  }
  const unscoped =
    pkg.name[0] === "@" ? pkg.name.replace(/@.*?\//, "") : pkg.name;
  return {
    version: pkg.version,
    npmUrl: `https://www.npmjs.com/package/${pkg.name}`,
    npmxUrl: `https://npmx.dev/package/${pkg.name}`,
    githubUrl: `https://github.com/x0k/svelte-jsonschema-form/tree/main/${pkg.directory}`,
    changelogPath: `changelogs/${unscoped}`,
  };
}

export function getPackageDependencies(pkg: Package) {
  const deps = [
    pkg,
    ...filterPackageDependencies(pkg.dependencies, [
      optionalPackageName("cally"),
      optionalPackageName("internationalizedDate"),
      optionalPackageName("skeletonSvelte"),
    ]),
  ];
  return deps.map((p) => p.name).join(" ");
}
