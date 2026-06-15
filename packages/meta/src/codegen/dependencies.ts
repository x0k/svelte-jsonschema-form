import { formPackage } from "../form.ts";
import { iconSetPackage } from "../icons.ts";
import {
  extraPackage,
  filterPackageDependencies,
  optionalPackageName,
  type AbstractPackage,
  type IncludeOptional,
  type PackageDependency,
} from "../package.ts";
import { sveltekitPackage } from "../sveltekit.ts";
import { tailwindcss4PluginPackage } from "../tailwindcss.ts";
import {
  isSubTheme,
  isTailwindcss4Theme,
  subThemeDependencies,
  tailwindcss4ThemePlugins,
  themePackage,
  toTheme,
  type ToTheme,
} from "../themes.ts";
import {
  externalValidatorPackage,
  isJsonSchemaValidator,
} from "../validators.ts";
import {
  themeExtraWidgetOptionalDependencies,
  type ExtraWidgetFileNames,
} from "../widgets.ts";
import {
  type CodegenValidator,
  type CodegenIconSet,
  type CodegenSvelteKitIntegration,
  type CodegenThemeOrSubTheme,
  codegenIsExternalValidator,
} from "./model.ts";

interface DependenciesOptions<T extends CodegenThemeOrSubTheme> {
  themeOrSubTheme: T;
  validator: CodegenValidator;
  icons: CodegenIconSet;
  sveltekit: CodegenSvelteKitIntegration;
  widgets: ExtraWidgetFileNames[ToTheme<T>][];
  addDependency: (pkg: AbstractPackage) => void;
}

export function resolveDependencies<T extends CodegenThemeOrSubTheme>({
  addDependency,
  themeOrSubTheme,
  validator,
  icons,
  sveltekit,
  widgets,
}: DependenciesOptions<T>) {
  function addDependencies(
    deps: Iterable<PackageDependency>,
    filter: IncludeOptional = false
  ) {
    for (const d of filterPackageDependencies(deps, filter)) {
      addDependency(d);
    }
  }
  // Form
  addDependency(formPackage);
  // Theme
  const theme = toTheme(themeOrSubTheme);
  const themePkg = themePackage(theme);
  addDependency(themePkg);
  const optionalDeps: string[] = [];
  if (widgets.length > 0) {
    for (const w of widgets) {
      for (const lib of themeExtraWidgetOptionalDependencies(theme, w)) {
        optionalDeps.push(lib);
      }
    }
  } else {
    optionalDeps.push(
      optionalPackageName("pikaday"),
      optionalPackageName("skeletonSvelte"),
      optionalPackageName("internationalizedDate")
    );
  }
  addDependencies(themePkg.dependencies, optionalDeps);
  if (isSubTheme(themeOrSubTheme)) {
    addDependencies(subThemeDependencies(themeOrSubTheme));
  }
  if (isTailwindcss4Theme(theme)) {
    addDependency(extraPackage("tailwindcss4"));
    addDependency(extraPackage("tailwindcss4Vite"));
    for (const p of tailwindcss4ThemePlugins(theme)) {
      addDependency(tailwindcss4PluginPackage(p));
    }
  }

  if (
    validator.precompiled ||
    validator.draft2020 ||
    codegenIsExternalValidator(validator)
  ) {
    // Validator
    const validatorPkg = externalValidatorPackage(validator.name);
    addDependency(validatorPkg);
    addDependencies(validatorPkg.dependencies);
    if (validator.name === "ajv8") {
      addDependency(extraPackage("ajvFormat"));
      if (validator.precompiled) {
        addDependency(extraPackage("esbuild"));
      }
    }
    if (validator.name === "hyperjump") {
      addDependency(extraPackage("devalue"));
    }
  } else {
    if (validator.name === "standard-schema") {
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
  if (
    isJsonSchemaValidator(validator.name) ||
    // Required for internal fake type
    validator.name === "standard-schema"
  ) {
    addDependency(extraPackage("jsonSchemaToTs"));
  }
  // Kit integration
  if (sveltekit !== "no") {
    addDependency(sveltekitPackage);
    addDependencies(sveltekitPackage.dependencies);
  }
}
