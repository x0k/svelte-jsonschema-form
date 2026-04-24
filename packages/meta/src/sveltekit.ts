import _packageJson from "@sjsf/sveltekit/package.json" with { type: "json" };

import { fromPackageJson } from "./package.ts";

export const sveltekitPackage = fromPackageJson(_packageJson);

export function kitRemoteFunctionsSubPath() {
  return `${sveltekitPackage.name}/rf`;
}
