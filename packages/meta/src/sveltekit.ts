import _packageJson from "@sjsf/sveltekit/package.json" with { type: "json" };
import _packageJson3 from "@sjsf/sveltekit3/package.json" with { type: "json" };
import {
  isKit3,
  KIT3_TSCONFIG,
  libSubpathImports,
  resolveLibPrefix,
} from "@sveltejs/sv-utils/browser";

import { fromPackageJson, type Package } from "./package.ts";

/** The SvelteKit 2 integration, for projects that target Kit 2. */
export const sveltekitPackage = fromPackageJson(_packageJson);

/** The SvelteKit 3 integration, for projects that target Kit 3. */
export const sveltekit3Package = fromPackageJson(_packageJson3);

/**
 * An export of a SvelteKit integration package, mirroring the `exports` map that
 * both packages declare. `""` is the package root (`.`).
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

/** Everything that varies with the target project's SvelteKit version. */
export interface SvelteKitProject {
  /** The integration package generated code imports from */
  pkg: Package;
  /** `src/lib` is reached through `#lib` on Kit 3, `$lib` on Kit 2 */
  libPrefix: "#lib" | "$lib";
  /** what the generated `tsconfig.json` extends */
  tsconfigExtends: string;
  /** `package.json#imports` backing `libPrefix`; empty when the version needs none */
  libImports: Record<string, string>;
}

const KIT2_TSCONFIG = "./.svelte-kit/tsconfig.json";

/** Assumed when the target project's `@sveltejs/kit` range is unknown */
const DEFAULT_KIT_RANGE = "^3.0.0";

/**
 * Resolves the integration and the project shape from the target project's
 * `@sveltejs/kit` range, defaulting to Kit 3 when it is unknown.
 *
 * Kit 2 and Kit 3 ship separate packages, and a Kit 3 app cannot use the Kit 2
 * one, so the version the project declares decides both.
 */
export function resolveSvelteKitProject(
  kitRange: string | undefined = DEFAULT_KIT_RANGE
): SvelteKitProject {
  const kit3 = isKit3(kitRange);
  return {
    pkg: kit3 ? sveltekit3Package : sveltekitPackage,
    libPrefix: resolveLibPrefix(kitRange),
    tsconfigExtends: kit3 ? KIT3_TSCONFIG : KIT2_TSCONFIG,
    libImports: kit3 ? libSubpathImports("src/lib") : {},
  };
}
