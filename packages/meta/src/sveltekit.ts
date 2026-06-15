import _packageJson from "@sjsf/sveltekit/package.json" with { type: "json" };

import { fromPackageJson } from "./package.ts";

export const sveltekitPackage = fromPackageJson(_packageJson);

const _SUB_PATHS = ["client", "server"] as const;

type SvelteKitSubPath = (typeof _SUB_PATHS)[number];

export function svelteKitSubPath(subPath: SvelteKitSubPath) {
  return `${sveltekitPackage.name}/${subPath}`;
}

export function svelteKitRfSubPath(subPath: SvelteKitSubPath | "" = "") {
  return `${sveltekitPackage.name}/rf${subPath && `/${subPath}`}`;
}
