import _packageJson from "@sjsf/sveltekit3/package.json" with { type: "json" };
import { KIT3_TSCONFIG, libSubpathImports } from "@sveltejs/sv-utils/browser";

import { fromPackageJson, type Package } from "./package.ts";

/** The SvelteKit integration, for projects that target Kit 3. */
export const sveltekitPackage: Package = fromPackageJson(_packageJson);

/**
 * An export of the SvelteKit integration package, mirroring the `exports` map
 * it declares. `""` is the package root (`.`).
 */
export type SvelteKitExport =
  | ""
  | "client"
  | "server"
  | "rf"
  | "rf/client"
  | "rf/server";

/**
 * The specifier a generated file imports `subPath` from,
 * e.g. `@sjsf/sveltekit3/rf/client`.
 */
export function svelteKitExport(
  pkg: Package,
  subPath: SvelteKitExport
): string {
  return `${pkg.name}${subPath && `/${subPath}`}`;
}

/** The SvelteKit project shape generated code targets. */
export interface SvelteKitProject {
  /** The integration package generated code imports from */
  pkg: Package;
  /** what the generated `tsconfig.json` extends */
  tsconfigExtends: string;
  /** `package.json#imports` backing the `#lib` alias */
  libImports: Record<string, string>;
}

/** Resolves the SvelteKit project shape generated code targets. */
export function resolveSvelteKitProject(): SvelteKitProject {
  return {
    pkg: sveltekitPackage,
    tsconfigExtends: KIT3_TSCONFIG,
    libImports: libSubpathImports("src/lib"),
  };
}
