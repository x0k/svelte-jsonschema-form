import type { AtRule } from "../css.ts";
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
import {
  tailwindcss4PluginPackage,
  type Tailwindcss4Plugin,
} from "../tailwindcss.ts";
import {
  isSubTheme,
  isTailwindcss4Theme,
  subThemeDependencies,
  tailwindcss4ThemePlugins,
  themePackage,
  toTheme,
} from "../themes.ts";
import {
  externalValidatorPackage,
  isInternalValidator,
  isJsonSchemaValidator,
} from "../validators.ts";

import {
  isEndsWithPrecompiled,
  withoutPrecompiledSuffix,
  type CodegenValidator,
  type CodegenIconSet,
  type CodegenSvelteKitIntegration,
  type CodegenThemeOrSubTheme,
} from "./model.ts";
import type { NamespaceImportOptions } from "./lib.ts";

interface DependenciesOptions {
  themeOrSubTheme: CodegenThemeOrSubTheme;
  validatorWithSuffix: CodegenValidator;
  icons: CodegenIconSet;
  sveltekit: CodegenSvelteKitIntegration;
  addDependency: (pkg: AbstractPackage) => void;
  addTailwindCss4: (plugins: Iterable<Tailwindcss4Plugin>) => void;
}

export function resolveDependencies({
  addDependency,
  addTailwindCss4,
  themeOrSubTheme,
  validatorWithSuffix,
  icons,
  sveltekit,
}: DependenciesOptions) {
  function addDependencies(
    deps: Iterable<PackageDependency>,
    filter: IncludeOptional = false,
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
  if (isTailwindcss4Theme(theme)) {
    addTailwindCss4(tailwindcss4ThemePlugins(theme));
  }
  if (
    isEndsWithPrecompiled(validatorWithSuffix) ||
    !isInternalValidator(validatorWithSuffix)
  ) {
    // Validator
    const validator = withoutPrecompiledSuffix(validatorWithSuffix);
    const validatorPkg = externalValidatorPackage(validator);
    addDependency(validatorPkg);
    addDependencies(validatorPkg.dependencies);
    if (validator === "ajv8") {
      addDependency(extraPackage("ajvFormat"));
    }
    if (validatorWithSuffix === "ajv8_precompiled") {
      addDependency(extraPackage("esbuild"));
    }
    if (validatorWithSuffix === "hyperjump_precompiled") {
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

export interface AddTailwindCss4Options {
  addDependency: (pkg: AbstractPackage) => void;
  addVitePlugin: (options: NamespaceImportOptions) => void;
  addAppCssRule: (rules: AtRule) => void;
}

export function createAddTailwind4Css({
  addDependency,
  addVitePlugin,
  addAppCssRule,
}: AddTailwindCss4Options) {
  return (plugins: Iterable<Tailwindcss4Plugin>) => {
    addDependency(extraPackage("tailwindcss4"));
    addDependency(extraPackage("tailwindcss4Vite"));
    for (const p of plugins) {
      addDependency(tailwindcss4PluginPackage(p));
    }
    addVitePlugin({
      as: "tailwindcss",
      from: "@tailwindcss/vite",
    });
    addAppCssRule({
      name: "import",
      params: `'tailwindcss'`,
    });
    for (const p of plugins) {
      const pkg = tailwindcss4PluginPackage(p);
      addAppCssRule({
        name: "plugin",
        params: `'${pkg.name}'`,
      });
    }
  };
}
