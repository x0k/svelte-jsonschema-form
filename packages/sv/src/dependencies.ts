import {
  externalValidatorPackage,
  filterPackageDependencies,
  iconSetPackage,
  isInternalValidator,
  isSubTheme,
  kitPackage,
  subThemeDependencies,
  themePackage,
  themeParent,
  type AbstractPackage,
  type IncludeOptional,
  type PackageDependency,
} from "meta";

import type { Context } from "./model.js";

export function dependencies({ sv, options }: Context) {
  function addDependency({ name, version, dev }: AbstractPackage) {
    if (dev) {
      sv.devDependency(name, version);
    } else {
      sv.dependency(name, version);
    }
  }
  function addDependencies(
    deps: Iterable<PackageDependency>,
    filter: IncludeOptional = false,
  ) {
    for (const d of filterPackageDependencies(deps, filter)) {
      addDependency(d);
    }
  }
  const { themeOrSubTheme, validator, icons, typeInference, sveltekit } =
    options;
  // Theme
  const themePkg = themePackage(
    isSubTheme(themeOrSubTheme)
      ? themeParent(themeOrSubTheme)
      : themeOrSubTheme,
  );
  addDependency(themePkg);
  addDependencies(themePkg.dependencies);
  if (isSubTheme(themeOrSubTheme)) {
    addDependencies(subThemeDependencies(themeOrSubTheme));
  }
  // Validator
  if (!isInternalValidator(validator)) {
    const validatorPkg = externalValidatorPackage(validator);
    addDependency(validatorPkg);
    addDependencies(validatorPkg.dependencies);
    if (validator === "ajv8") {
      addDependency({ name: "ajv-format", version: "^3.0.0", dev: false });
    }
  }
  // Icons
  if (icons !== "none") {
    const iconsPkg = iconSetPackage(icons);
    addDependency(iconsPkg);
    addDependencies(iconsPkg.dependencies);
  }
  // Type inference
  if (typeInference) {
    addDependency({ name: "json-schema-to-ts", version: "^3.1.0", dev: true });
  }
  // Kit integration
  if (sveltekit !== "no") {
    addDependency(kitPackage);
    addDependencies(kitPackage.dependencies);
  }
}
