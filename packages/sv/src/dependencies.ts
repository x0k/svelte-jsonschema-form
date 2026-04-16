import {
  externalValidatorPackage,
  extraPackage,
  filterPackageDependencies,
  formPackage,
  iconSetPackage,
  isInternalValidator,
  isSubTheme,
  kitPackage,
  optionalPackageName,
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
  addDependencies(themePkg.dependencies, [
    // daisyui5
    optionalPackageName("pikaday"),
    // skeleton4
    optionalPackageName("skeletonSvelte"),
    // shadcn4
    optionalPackageName("internationalizedDate"),
  ]);
  if (isSubTheme(themeOrSubTheme)) {
    addDependencies(subThemeDependencies(themeOrSubTheme));
  }
  // Validator
  if (isInternalValidator(validator)) {
    if (validator === "standard-schema") {
      addDependencies(formPackage.dependencies, [
        optionalPackageName("standardSchemaSpec"),
      ]);
    }
  } else {
    const validatorPkg = externalValidatorPackage(validator);
    addDependency(validatorPkg);
    addDependencies(validatorPkg.dependencies);
    if (validator === "ajv8") {
      addDependency(extraPackage("ajvFormat"));
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
    addDependency(extraPackage("jsonSchemaToTs"));
  }
  // Kit integration
  if (sveltekit !== "no") {
    addDependency(kitPackage);
    addDependencies(kitPackage.dependencies);
  }
}
