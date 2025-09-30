import { unique } from "@sjsf/form/lib/array";
import type { SchemaValue } from "@sjsf/form";

import {
  validatorPackage,
  type ActualTheme,
  type Resolver,
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

export interface ViteConfig {
  plugins?: Record<string, VitePluginConfig>;
}

export interface LayerFiles {
  [filename: string]: string;
}

export interface FormDefaultsConfig {
  theme?: ActualTheme;
  widgets?: string[];
  validator?: Validator;
  resolver?: Resolver;
}

export interface Layer {
  package?: PackageConfig;
  vite?: ViteConfig;
  files?: LayerFiles;
  formDefaults?: FormDefaultsConfig;
}

export const BASE_PACKAGES = ["ajv", "@sjsf/ajv8-validator"];

function mergePackageConfigs(
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

function mergeViteConfigs(a: ViteConfig, b: ViteConfig): ViteConfig {
  return {
    plugins: {
      ...a.plugins,
      ...b.plugins,
    },
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
  };
}

function buildPackageConfig(config: PackageConfig): string {
  return JSON.stringify(config, null, 2);
}

function buildViteConfig({ plugins = {} }: ViteConfig): string {
  return `import { defineConfig } from 'vite';
${Object.entries(plugins)
  .map(([pkg, p]) => `import ${p.import} from "${pkg}";`)
  .join("\n")}
export default defineConfig({
  plugins: [${Object.values(plugins)
    .map((p) => p.call)
    .join(", ")}]
})`;
}

function buildFormDefaultsConfig({
  resolver = "basic",
  theme = "basic",
  validator = "Ajv",
  widgets = [],
}: FormDefaultsConfig): string {
  const pkg = validatorPackage(validator);
  const validatorCode = pkg
    ? `
export { createFormValidator as validator } from "${pkg}";
`
    : "";
  return `export { resolver } from "@sjsf/form/resolvers/${resolver}";

export { theme } from "@sjsf/${theme}-theme";
${widgets.map((w) => `import "@sjsf/${theme}-theme/extra-widgets/${w}-include";`).join("\n")}

export { translation } from "@sjsf/form/translations/en";

export { createFormIdBuilder as idBuilder } from "@sjsf/form/id-builders/modern";

export { createFormMerger as merger } from "@sjsf/form/mergers/modern";
${validatorCode}`;
}

export function buildLayer(layer: Layer): LayerFiles {
  const files = {
    ...layer.files,
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
