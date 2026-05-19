import { unique } from "@sjsf/form/lib/array";

import { themePackage, type Theme } from "../themes.ts";
import {
  externalValidatorPackage,
  isJsonSchemaValidator,
  type Validator,
} from "../validators.ts";
import type { Resolver } from "../form.ts";
import {
  themeExtraWidgetSubPath,
  type ExtraWidgetFileNames,
} from "../widgets.ts";
import type { AbstractPackage } from "../package.ts";

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

export interface ViteConfig {
  plugins?: Record<string, VitePluginConfig>;
  optimizeDeps?: ViteOptimizeDepsConfig;
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
  runes?: boolean;
}

export interface SvelteKitConfig {
  alias?: Record<string, string>;
}

export interface SvelteConfig {
  compilerOptions?: SvelteCompilerOptions;
  kit?: SvelteKitConfig;
}

export interface Layer {
  svelte?: SvelteConfig;
  package?: PackageConfig;
  vite?: ViteConfig;
  files?: LayerFiles;
  codeTransformers?: CodeTransformer[];
  formDefaults?: FormDefaultsConfig<"basic">;
}

// export const MARKDOWN_DESCRIPTION_PACKAGES = ["svelte-exmarkdown"];
// export const DRAFT_2020_12_PACKAGES = ["json-schema-typed"];
// export const BASE_PACKAGES = [
//   "ajv",
//   "@sjsf/ajv8-validator",
//   ...MARKDOWN_DESCRIPTION_PACKAGES,
//   ...DRAFT_2020_12_PACKAGES,
// ];
function mergeArrays<T>(a: T[] | undefined, b: T[] | undefined) {
  return a ? (b ? [...a, ...b] : a) : b;
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
    compilerOptions:
      a.compilerOptions && b.compilerOptions
        ? mergerSvelteCompilerOptions(a.compilerOptions, b.compilerOptions)
        : (a.compilerOptions ?? b.compilerOptions),
    kit: a.kit && b.kit ? mergeSvelteKitConfig(a.kit, b.kit) : (a.kit ?? b.kit),
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
    exclude: unique([...(a.exclude ?? []), ...(b.exclude ?? [])]),
  };
}

function mergeViteConfigs(a: ViteConfig, b: ViteConfig): ViteConfig {
  return {
    plugins: {
      ...a.plugins,
      ...b.plugins,
    },
    optimizeDeps:
      a.optimizeDeps && b.optimizeDeps
        ? mergeViteOptimizeDepsConfigs(a.optimizeDeps, b.optimizeDeps)
        : (a.optimizeDeps ?? b.optimizeDeps),
  };
}

function mergeFormDefaultsConfig<T extends Theme>(
  a: FormDefaultsConfig<T>,
  b: FormDefaultsConfig<T>,
): FormDefaultsConfig<T> {
  return {
    ...a,
    ...b,
    widgets: unique([...(a.widgets ?? []), ...(b.widgets ?? [])]),
  };
}

export function mergeLayers(a: Layer, b: Layer): Layer {
  return {
    package:
      a.package && b.package
        ? mergePackageConfigs(a.package, b.package)
        : (b.package ?? a.package),
    vite:
      a.vite && b.vite ? mergeViteConfigs(a.vite, b.vite) : (b.vite ?? a.vite),
    formDefaults:
      a.formDefaults && b.formDefaults
        ? mergeFormDefaultsConfig(a.formDefaults, b.formDefaults)
        : (b.formDefaults ?? a.formDefaults),
    files: {
      ...a.files,
      ...b.files,
    },
    codeTransformers: mergeArrays(a.codeTransformers, b.codeTransformers),
    svelte:
      a.svelte && b.svelte
        ? mergeSvelteConfig(a.svelte, b.svelte)
        : (a.svelte ?? b.svelte),
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
        start: "vite dev",
      },
    },
    null,
    2,
  );
}

function buildViteConfig({
  plugins = {},
  optimizeDeps = {},
}: ViteConfig): string {
  return `import { defineConfig } from 'vite';
${Object.entries(plugins)
  .map(([pkg, p]) => `import ${p.import} from "${pkg}";`)
  .join("\n")}
export default defineConfig({
  plugins: [${Object.values(plugins)
    .map((p) => p.call)
    .join(", ")}],
  optimizeDeps: ${JSON.stringify(optimizeDeps)}
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
  return `export { resolver } from "@sjsf/form/resolvers/${resolver}";

export { theme } from "${themePackage(theme).name}";
${widgets.map((w) => `import "${themeExtraWidgetSubPath(theme, w, true)}";`).join("\n")}

export { translation } from "@sjsf/form/translations/en";

export { createFormIdBuilder as idBuilder } from "${idBuilderPackage}";

export { createFormMerger as merger } from "@sjsf/form/mergers/modern";
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
    runes: ${runes ? "true" : "undefined"},
    experimental: {
      async: true,
    },
  },
};

export default config;
`;
}

export function buildLayer(layer: Layer): LayerFiles {
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

export function buildLayers(layers: Layer[]): LayerFiles {
  return buildLayer(layers.reduce(mergeLayers));
}
