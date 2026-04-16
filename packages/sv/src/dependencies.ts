import {
  externalValidatorDependencies,
  externalValidatorPackage,
  iconSetDependencies,
  iconSetPackage,
  isInternalValidator,
  isSubTheme,
  kitDependencies,
  kitPackage,
  themeDependencies,
  themePackage,
  themeParent,
} from "meta";

import type { Context } from "./model.js";

export function dependencies({ sv, options }: Context) {
  const seen = new Set<string>();
  function addDependency({ name, version }: { name: string; version: string }) {
    if (seen.has(name)) {
      return;
    }
    seen.add(name);
    sv.dependency(name, version);
  }
  function addDependencies(deps: Iterable<[string, string]>) {
    for (const [name, version] of deps) {
      addDependency({ name, version });
    }
  }
  const { themeOrSubTheme, validator, icons, typeInference, sveltekit } =
    options;
  // Theme
  const theme = isSubTheme(themeOrSubTheme)
    ? themeParent(themeOrSubTheme)
    : themeOrSubTheme;
  addDependency(themePackage(theme));
  addDependencies(themeDependencies(theme));
  // Validator
  if (!isInternalValidator(validator)) {
    addDependency(externalValidatorPackage(validator));
    addDependencies(externalValidatorDependencies(validator));
    if (validator === "ajv8") {
      addDependency({ name: "ajv-format", version: "^3.0.0" });
    }
  }
  // Icons
  if (icons !== "none") {
    addDependency(iconSetPackage(icons));
    addDependencies(iconSetDependencies(icons));
  }
  // Type inference
  if (typeInference) {
    addDependency({ name: "json-schema-to-ts", version: "^3.1.0" });
  }
  // Kit integration
  if (sveltekit !== "no") {
    addDependency(kitPackage());
    addDependencies(kitDependencies());
  }
}
