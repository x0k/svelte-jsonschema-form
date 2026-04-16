import packageJson from "@sjsf/sveltekit/package.json" with { type: "json" };

import { peerDependencies, type Package } from "./package.js";

export function kitPackage(): Package {
  return packageJson;
}

export function kitPackageName() {
  return packageJson.name;
}

export function kitRemoteFunctionsSubPath() {
  return `${packageJson.name}/rf`;
}

export function kitDependencies() {
  return peerDependencies(packageJson);
}
