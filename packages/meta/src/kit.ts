import _packageJson from "@sjsf/sveltekit/package.json" with { type: "json" };

import { fromPackageJson } from "./package.ts";

export const kitPackage = fromPackageJson(_packageJson);

export function kitRemoteFunctionsSubPath() {
  return `${kitPackage.name}/rf`;
}
