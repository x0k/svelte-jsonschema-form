import {
  externalValidatorDependencies,
  externalValidatorPackage,
  iconSetDependencies,
  iconSetPackage,
  isInternalValidator,
  isSubTheme,
  kitDependencies,
  kitPackage,
  subThemeDependencies,
  themeDependencies,
  themePackage,
  themeParent,
  type PackageDependency,
} from "meta";

import type { Context } from "./model.js";

export function dependencies({ sv, options }: Context) {
  const seen = new Set<string>();
  function addDependency({
    name,
    version,
    dev = false,
  }: {
    name: string;
    version: string;
    dev?: boolean;
  }) {
    if (seen.has(name)) {
      return;
    }
    seen.add(name);
    if (dev) {
      sv.devDependency(name, version);
    } else {
      sv.dependency(name, version);
    }
  }
  function addDependencies(deps: Iterable<PackageDependency>) {
    for (const d of deps) {
      addDependency(d);
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
  if (isSubTheme(themeOrSubTheme)) {
    addDependencies(subThemeDependencies(themeOrSubTheme));
  }
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
    addDependency({ name: "json-schema-to-ts", version: "^3.1.0", dev: true });
  }
  // Kit integration
  if (sveltekit !== "no") {
    addDependency(kitPackage());
    addDependencies(kitDependencies());
  }
}
