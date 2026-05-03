import {
  externalValidatorPackage,
  extraPackage,
  filterPackageDependencies,
  formPackage,
  iconSetPackage,
  isInternalValidator,
  isSubTheme,
  sveltekitPackage,
  optionalPackageName,
  subThemeDependencies,
  themePackage,
  themeParent,
  type AbstractPackage,
  type IncludeOptional,
  type PackageDependency,
  isJsonSchemaValidator,
} from "meta";

import {
  isEndsWithPrecompiled,
  withoutPrecompiledSuffix,
  type Context,
} from "./model.js";

export function dependencies(ctx: Context) {
  const { sv, options } = ctx;
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
  const { themeOrSubTheme, validatorWithSuffix, icons, sveltekit } = options;
  // Form
  addDependency(formPackage);
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
  if (
    isEndsWithPrecompiled(validatorWithSuffix) ||
    !isInternalValidator(validatorWithSuffix)
  ) {
    const validator = withoutPrecompiledSuffix(validatorWithSuffix);
    const validatorPkg = externalValidatorPackage(validator);
    addDependency(validatorPkg);
    addDependencies(validatorPkg.dependencies);
    if (validator === "ajv8") {
      addDependency(extraPackage("ajvFormat"));
    }
    if (validatorWithSuffix === "ajv8-precompiled") {
      addDependency(extraPackage("esbuild"));
    }
    if (validatorWithSuffix === "hyperjump-precompiled") {
      addDependency(extraPackage("devalue"));
    }
  } else {
    if (validatorWithSuffix === "standard-schema") {
      addDependencies(formPackage.dependencies, [
        optionalPackageName("standardSchemaSpec"),
      ]);
    }
  }
  // Icons
  if (icons !== "none") {
    const iconsPkg = iconSetPackage(icons);
    addDependency(iconsPkg);
    addDependencies(iconsPkg.dependencies);
  }
  // Type inference
  if (isJsonSchemaValidator(withoutPrecompiledSuffix(validatorWithSuffix))) {
    addDependency(extraPackage("jsonSchemaToTs"));
  }
  // Kit integration
  if (sveltekit !== "no") {
    addDependency(sveltekitPackage);
    addDependencies(sveltekitPackage.dependencies);
  }
}
