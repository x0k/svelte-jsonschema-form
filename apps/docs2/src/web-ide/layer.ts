import { unique } from "@sjsf/form/lib/array";
import type { SchemaValue } from "@sjsf/form";

import {
  isLabTheme,
  validatorPackage,
  VERSION,
  type Resolver,
  type Theme,
  type Validator,
} from "@/shared";

export interface PackageConfig {
  [key: string]: SchemaValue | undefined;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
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

export interface FormDefaultsConfig {
  theme?: Theme;
  widgets?: string[];
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
  formDefaults?: FormDefaultsConfig;
}

export const BASE_PACKAGES = ["ajv", "@sjsf/ajv8-validator"];

function mergerSvelteCompilerOptions(
  a: SvelteCompilerOptions,
  b: SvelteCompilerOptions
): SvelteCompilerOptions {
  return {
    ...a,
    ...b,
    runes: a.runes && b.runes,
  };
}

function mergeSvelteKitConfig(
  a: SvelteKitConfig,
  b: SvelteKitConfig
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
  b: PackageConfig
): PackageConfig {
  return {
    ...a,
    dependencies: {
      ...a.dependencies,
      ...b.dependencies,
    },
    devDependencies: {
      ...a.devDependencies,
      ...b.devDependencies,
    },
  };
}

function mergeViteOptimizeDepsConfigs(
  a: ViteOptimizeDepsConfig,
  b: ViteOptimizeDepsConfig
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

function mergeFormDefaultsConfig(
  a: FormDefaultsConfig,
  b: FormDefaultsConfig
): FormDefaultsConfig {
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
    svelte:
      a.svelte && b.svelte
        ? mergeSvelteConfig(a.svelte, b.svelte)
        : (a.svelte ?? b.svelte),
  };
}

const MAJOR_VERSION = VERSION.split(".")[0];
function buildPackageConfig(config: PackageConfig): string {
  return JSON.stringify(
    config,
    (key, value) => {
      if (value === "workspace:*") {
        if (key.startsWith("@sjsf-lab/")) {
          return MAJOR_VERSION
        }
        // TODO: Consider fixed list from changeset config
        return VERSION;
      }
      return value;
    },
    2
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

function buildFormDefaultsConfig({
  resolver = "basic",
  theme = "basic",
  validator = "Ajv",
  widgets = [],
  idBuilderPackage = "@sjsf/form/id-builders/modern"
}: FormDefaultsConfig): string {
  const pkg = validatorPackage(validator);
  const validatorCode = pkg
    ? `
export { createFormValidator as validator } from "${pkg}";
`
    : "";
  return `export { resolver } from "@sjsf/form/resolvers/${resolver}";

export { theme } from "@sjsf${isLabTheme(theme) ? "-lab" : ""}/${theme}-theme";
${widgets.map((w) => `import "@sjsf/${theme}-theme/extra-widgets/${w}-include";`).join("\n")}

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
      layer.formDefaults
    );
  }
  return files;
}

export function buildLayers(layers: Layer[]): LayerFiles {
  return buildLayer(layers.reduce(mergeLayers));
}

export function omitPackages(
  config: PackageConfig,
  packages: string[]
): PackageConfig {
  const deps = new Map(Object.entries(config.dependencies ?? {}));
  const devDeps = new Map(Object.entries(config.devDependencies ?? {}));
  for (const pkg of packages) {
    deps.delete(pkg);
    devDeps.delete(pkg);
  }
  return {
    ...config,
    dependencies: Object.fromEntries(deps),
    devDependencies: Object.fromEntries(devDeps),
  };
}

export function omitBasePackages(config: PackageConfig): PackageConfig {
  return omitPackages(config, BASE_PACKAGES);
}
