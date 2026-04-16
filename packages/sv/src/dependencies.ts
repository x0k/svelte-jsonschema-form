import {
  externalValidatorPackage,
  EXTRA_PKG,
  filterPackageDependencies,
  formPackage,
  iconSetPackage,
  isInternalValidator,
  isSubTheme,
  kitPackage,
  OPTIONAL_PKG,
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
  addDependencies(
    themePkg.dependencies,
    new Set([
      // daisyui5
      OPTIONAL_PKG.pikaday,
      // skeleton4
      OPTIONAL_PKG.skeletonSvelte,
      // shadcn4
      OPTIONAL_PKG.internationalizedDate,
    ]),
  );
  if (isSubTheme(themeOrSubTheme)) {
    addDependencies(subThemeDependencies(themeOrSubTheme));
  }
  // Validator
  if (isInternalValidator(validator)) {
    if (validator === "standard-schema") {
      addDependencies(
        formPackage.dependencies,
        new Set([OPTIONAL_PKG.standardSchemaSpec]),
      );
    }
  } else {
    const validatorPkg = externalValidatorPackage(validator);
    addDependency(validatorPkg);
    addDependencies(validatorPkg.dependencies);
    if (validator === "ajv8") {
      addDependency(EXTRA_PKG.ajvFormat);
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
    addDependency(EXTRA_PKG.jsonSchemaToTs);
  }
  // Kit integration
  if (sveltekit !== "no") {
    addDependency(kitPackage);
    addDependencies(kitPackage.dependencies);
  }
}
