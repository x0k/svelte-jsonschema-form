import { unique } from "@sjsf/form/lib/array";
import type { Config as KitConfig } from "@sveltejs/kit";

import {
  isSubTheme,
  subThemeDependencies,
  themePackage,
  type Theme,
} from "../themes.ts";
import {
  externalValidatorPackage,
  isJsonSchemaValidator,
  type Validator,
} from "../validators.ts";
import {
  formMergerSubPath,
  formResolverSubPath,
  formTranslationSubPath,
  type Resolver,
} from "../form.ts";
import {
  themeExtraWidgetSubPath,
  type ExtraWidgetFileNames,
} from "../widgets.ts";
import {
  filterPackageDependencies,
  type AbstractPackage,
  type IncludeOptional,
} from "../package.ts";

export interface PackageConfig {
  name?: string;
  dependencies?: AbstractPackage[];
}

export interface VitePluginConfig {
  import: string;
  call: string;
}

export interface ViteOptimizeDepsConfig {
  exclude?: string[];
}

export interface ViteResolveConfig {
  noExternal?: string[];
}

export interface ViteConfig {
  plugins?: Record<string, VitePluginConfig>;
  optimizeDeps?: ViteOptimizeDepsConfig;
  resolve?: ViteResolveConfig;
}

export interface LayerFiles {
  [filename: string]: string;
}

export type CodeTransformer = (filename: string, code: string) => string;

export interface FormDefaultsConfig<T extends Theme> {
  theme?: T;
  widgets?: ExtraWidgetFileNames[T][];
  validator?: Validator;
  resolver?: Resolver;
  idBuilderPackage?: string;
}

export interface SvelteCompilerOptions {
  runes?: NonNullable<KitConfig["compilerOptions"]>["runes"];
}

export interface SvelteKitConfig {
  alias?: Record<string, string>;
}

export interface SvelteConfig {
  compilerOptions?: SvelteCompilerOptions;
  kit?: SvelteKitConfig;
}

export interface Layer<T extends Theme> {
  svelte?: SvelteConfig;
  package?: PackageConfig;
  vite?: ViteConfig;
  files?: LayerFiles;
  codeTransformers?: CodeTransformer[];
  formDefaults?: FormDefaultsConfig<T>;
}

function mergeArrays<T>(
  a: T[] | undefined,
  b: T[] | undefined,
  merge = (arr: T[]) => arr,
) {
  return a ? (b ? merge([...a, ...b]) : a) : b;
}

function mergeObjects<T>(
  a: T | undefined,
  b: T | undefined,
  merge: (a: T, b: T) => T,
) {
  return a !== undefined ? (b !== undefined ? merge(a, b) : a) : b;
}

function mergerSvelteCompilerOptions(
  a: SvelteCompilerOptions,
  b: SvelteCompilerOptions,
): SvelteCompilerOptions {
  return {
    ...a,
    ...b,
    runes: a.runes && b.runes,
  };
}

function mergeSvelteKitConfig(
  a: SvelteKitConfig,
  b: SvelteKitConfig,
): SvelteKitConfig {
  return {
    ...a,
    ...b,
    alias: {
      ...a.alias,
      ...b.alias,
    },
  };
}

function mergeSvelteConfig(a: SvelteConfig, b: SvelteConfig): SvelteConfig {
  return {
    ...a,
    ...b,
    compilerOptions: mergeObjects(
      a.compilerOptions,
      b.compilerOptions,
      mergerSvelteCompilerOptions,
    ),
    kit: mergeObjects(a.kit, b.kit, mergeSvelteKitConfig),
  };
}

export function mergePackageConfigs(
  a: PackageConfig,
  b: PackageConfig,
): PackageConfig {
  return {
    ...a,
    ...b,
    dependencies: mergeArrays(a.dependencies, b.dependencies),
  };
}

function mergeViteOptimizeDepsConfigs(
  a: ViteOptimizeDepsConfig,
  b: ViteOptimizeDepsConfig,
): ViteOptimizeDepsConfig {
  return {
    ...a,
    ...b,
    exclude: mergeArrays(a.exclude, b.exclude, unique),
  };
}

function mergeViteResolveConfigs(
  a: ViteResolveConfig,
  b: ViteResolveConfig,
): ViteResolveConfig {
  return {
    ...a,
    ...b,
    noExternal: mergeArrays(a.noExternal, b.noExternal, unique),
  };
}

function mergeViteConfigs(a: ViteConfig, b: ViteConfig): ViteConfig {
  return {
    plugins: {
      ...a.plugins,
      ...b.plugins,
    },
    optimizeDeps: mergeObjects(
      a.optimizeDeps,
      b.optimizeDeps,
      mergeViteOptimizeDepsConfigs,
    ),
    resolve: mergeObjects(a.resolve, b.resolve, mergeViteResolveConfigs),
  };
}

function mergeFormDefaultsConfig<T extends Theme>(
  a: FormDefaultsConfig<T>,
  b: FormDefaultsConfig<T>,
): FormDefaultsConfig<T> {
  return {
    ...a,
    ...b,
    widgets: mergeArrays(a.widgets, b.widgets, unique),
  };
}

export function mergeLayers<T extends Theme>(
  a: Layer<T>,
  b: Layer<T>,
): Layer<T> {
  return {
    package: mergeObjects(a.package, b.package, mergePackageConfigs),
    vite: mergeObjects(a.vite, b.vite, mergeViteConfigs),
    formDefaults: mergeObjects(
      a.formDefaults,
      b.formDefaults,
      mergeFormDefaultsConfig,
    ),
    files: {
      ...a.files,
      ...b.files,
    },
    codeTransformers: mergeArrays(a.codeTransformers, b.codeTransformers),
    svelte: mergeObjects(a.svelte, b.svelte, mergeSvelteConfig),
  };
}

function buildPackageConfig({
  name,
  dependencies: deps = [],
}: PackageConfig): string {
  const dependencies: Record<string, string> = {};
  const devDependencies: Record<string, string> = {};
  for (const d of deps) {
    (d.dev ? devDependencies : dependencies)[d.name] = `^${d.version}`;
  }
  return JSON.stringify(
    {
      name,
      version: "0.0.1",
      type: "module",
      dependencies,
      devDependencies,
      scripts: {
        dev: "vite dev",
      },
    },
    null,
    2,
  );
}

function buildViteConfig({
  plugins = {},
  optimizeDeps = {},
  resolve = {},
}: ViteConfig): string {
  return `import { defineConfig } from 'vite';
${Object.entries(plugins)
  .map(([pkg, p]) => `import ${p.import} from "${pkg}";`)
  .join("\n")}
export default defineConfig({
  plugins: [${Object.values(plugins)
    .map((p) => p.call)
    .join(", ")}],
  optimizeDeps: ${JSON.stringify(optimizeDeps)},
  resolve: ${JSON.stringify(resolve)}
})`;
}

function buildFormDefaultsConfig<T extends Theme>({
  resolver = "basic",
  theme = "basic" as T,
  validator = "ajv8",
  widgets = [],
  idBuilderPackage = "@sjsf/form/id-builders/modern",
}: FormDefaultsConfig<T>): string {
  const validatorCode = isJsonSchemaValidator(validator)
    ? `
export { createFormValidator as validator } from "${externalValidatorPackage(validator).name}";
`
    : "";
  return `export { resolver } from "${formResolverSubPath(resolver)}";

export { theme } from "${themePackage(theme).name}";
${widgets.map((w) => `import "${themeExtraWidgetSubPath(theme, w, true)}";`).join("\n")}

export { translation } from "${formTranslationSubPath("en")}";

export { createFormIdBuilder as idBuilder } from "${idBuilderPackage}";

export { createFormMerger as merger } from "${formMergerSubPath("modern")}";
${validatorCode}`;
}

function buildSvelteConfig(config?: SvelteConfig) {
  const runes = config?.compilerOptions?.runes ?? true;
  const kitAlias = config?.kit?.alias ?? {};
  return `import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    experimental: {
      remoteFunctions: true,
    },
    alias: ${JSON.stringify(kitAlias)},
  },
  compilerOptions: {
    runes: ${runes ? runes : "undefined"},
    experimental: {
      async: true,
    },
  },
};

export default config;
`;
}

export function buildLayer<T extends Theme>(layer: Layer<T>): LayerFiles {
  const files: LayerFiles = {
    ...layer.files,
    "svelte.config.js": buildSvelteConfig(layer.svelte),
  };
  if (layer.package) {
    files["package.json"] = buildPackageConfig(layer.package);
  }
  if (layer.vite) {
    files["vite.config.js"] = buildViteConfig(layer.vite);
  }
  if (layer.formDefaults) {
    files["src/lib/form-defaults.ts"] = buildFormDefaultsConfig(
      layer.formDefaults,
    );
  }
  if (layer.codeTransformers) {
    for (const transform of layer.codeTransformers) {
      for (const [filename, content] of Object.entries(files)) {
        files[filename] = transform(filename, content);
      }
    }
  }
  return files;
}

export function buildLayers<T extends Theme>(layers: Layer<T>[]): LayerFiles {
  return buildLayer(layers.reduce(mergeLayers));
}

export function* themeDependencies(
  theme: Theme,
  filter: IncludeOptional = false,
) {
  const pkg = themePackage(theme);
  yield pkg;
  yield* filterPackageDependencies(pkg.dependencies, filter);
  if (isSubTheme(theme)) {
    yield* subThemeDependencies(theme);
  }
}

export function defineLayer<T extends Theme = any>(layer: Layer<T>) {
  return layer;
}
