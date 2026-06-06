import type { Schema, UiSchemaRoot, FormValue } from "@sjsf/form";

import {
  type CodegenThemeOrSubTheme,
  type CodegenIconSet,
  type CodegenValidator,
  type CodegenSvelteKitIntegration,
  type CodegenNonPrecompiledValidator,
  type ConditionalPrinter,
  type Language,
  type PathFactory,
  createDefaults,
  createLayout,
  createPage,
  createStyles,
  resolveDependencies,
  PADDED_THEMES,
  createAppHtml,
  createViteConfig,
  createShadcnLib,
  createModel,
  withoutPrecompiledSuffix,
  type MergerOptions,
} from "../codegen/index.ts";
import {
  extraPackage,
  filterPackageDependencies,
  type AbstractPackage,
} from "../package.ts";
import { sveltekitPackage } from "../sveltekit.ts";
import type { ToTheme } from "../themes.ts";
import type { ExtraWidgetFileNames } from "../widgets.ts";

import { buildPackageJson } from "./package-json.ts";

export type CodeTransformer = (filepath: string, code: string) => string;

export interface ComposerOptions<T extends CodegenThemeOrSubTheme> {
  name: string;
  language: Language;
  themeOrSubTheme: T;
  icons: CodegenIconSet;
  validatorWithSuffix: CodegenValidator;
  sveltekit: CodegenSvelteKitIntegration;
  widgets: ExtraWidgetFileNames[ToTheme<T>][];
  extraFiles: Record<string, string>;
  extraDependencies: AbstractPackage[];
  codeTransformers: CodeTransformer[];
  modelName: string;
  schema?: Schema;
  uiSchema?: UiSchemaRoot;
  initialValue?: FormValue;
  disabled?: boolean;
  merger?: Partial<MergerOptions>;
  focusOnFirstError?: boolean;
  uiOptionsRegistry?: Record<string, unknown>;
}

const TSCONFIG = JSON.stringify(
  {
    extends: "./.svelte-kit/tsconfig.json",
    compilerOptions: {
      allowJs: true,
      checkJs: true,
      esModuleInterop: true,
      forceConsistentCasingInFileNames: true,
      resolveJsonModule: true,
      skipLibCheck: true,
      sourceMap: true,
      strict: true,
      moduleResolution: "bundler",
    },
  },
  null,
  2,
);

const APP_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%sveltekit.assets%/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>`;

const getLayoutContent = (padded: boolean) => `<script lang="ts">
  import type { Snippet } from 'svelte';

  const { children }: { children: Snippet } = $props()
</script>

${
  padded
    ? `<div style="padding: 2rem">{@render children()}</div>`
    : `{@render children()}`
}
`;

const SVELTE_CONFIG = `import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    experimental: {
      remoteFunctions: true,
    },
  },
  compilerOptions: {
    runes: true,
    experimental: {
      async: true,
    },
  },
};

export default config;
`;

const VITE_CONFIG = `import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({ plugins: [sveltekit()] });`;

export function createComposer<T extends CodegenThemeOrSubTheme>(
  options: ComposerOptions<T>,
): Record<string, string> {
  const {
    name,
    language,
    themeOrSubTheme,
    icons,
    validatorWithSuffix,
    sveltekit,
    widgets,
    extraFiles,
    extraDependencies,
    codeTransformers,
    modelName,
    // Optional
    schema,
    initialValue,
    uiSchema = {},
    disabled = false,
    merger = {},
    focusOnFirstError = true,
    uiOptionsRegistry = {},
  } = options;
  const isKit = true;
  const nodeModulesPath = "../../node_modules";
  const isTs = language === "ts";
  const ts: ConditionalPrinter = (content, alt = "") => (isTs ? content : alt);
  const lib: PathFactory = (path) => `$lib/${path}`;

  const dependencies: AbstractPackage[] = [
    extraPackage("vite"),
    extraPackage("svelteAdapterAuto"),
    extraPackage("svelteVitePlugin"),
    extraPackage("typescript"),
    ...extraDependencies,
    ...filterPackageDependencies(sveltekitPackage.dependencies, false),
  ];

  function addDependency(pkg: AbstractPackage) {
    dependencies.push(pkg);
  }

  resolveDependencies({
    addDependency,
    themeOrSubTheme,
    validatorWithSuffix,
    icons,
    sveltekit,
    widgets,
  });

  const files: Record<string, string> = {
    "package.json": buildPackageJson({
      name,
      dependencies: new Map(dependencies.map((d) => [d.name, d])).values(),
    }),
    "vite.config.js": createViteConfig({
      themeOrSubTheme,
      icons,
      sveltekit,
    })(VITE_CONFIG),
    "svelte.config.js": SVELTE_CONFIG,
    "tsconfig.json": TSCONFIG,
    "src/app.html": createAppHtml({ themeOrSubTheme })(APP_HTML),
    "src/lib/sjsf/defaults.ts": createDefaults({
      themeOrSubTheme,
      validatorWithSuffix,
      icons,
      resolver: "basic",
      sveltekit,
      widgets,
      isTs,
      ts,
      merger,
      focusOnFirstError,
      uiOptionsRegistry,
    })(""),
    "src/routes/+page.svelte": createPage({
      language,
      themeOrSubTheme,
      validatorWithSuffix,
      sveltekit,
      isTs,
      lib,
      modelName,
      disabled,
      uiSchema,
      initialValue,
    })(""),
  };

  if (schema) {
    files[`src/lib/${modelName}.${language}`] = createModel({
      validator: withoutPrecompiledSuffix(
        validatorWithSuffix,
      ) as CodegenNonPrecompiledValidator,
      isTs,
      ts,
      schema,
      modelName,
      uiSchema,
      initialValue: initialValue as FormValue,
    })("");
  }

  function addFile(filePath: string, content: string) {
    if (content) {
      files[filePath] = content;
    }
    return content;
  }

  const stylesContent = addFile(
    "src/routes/layout.css",
    createStyles({
      nodeModulesPath,
      themeOrSubTheme,
      icons,
      sandbox: true,
    })(""),
  );

  // NOTE: We cannot move the padding functionality to `createLayout` because
  // it is used in `sv` to create the global layout (should not be padded)
  const layout = getLayoutContent(PADDED_THEMES.includes(themeOrSubTheme));
  files["src/routes/+layout.svelte"] = createLayout({
    language,
    themeOrSubTheme,
    lib,
    isKit,
    stylesheetPath: stylesContent && "./layout.css",
  })(layout);

  addFile(
    `src/lib/sjsf/shadcn.${language}`,
    createShadcnLib({
      themeOrSubTheme,
      resolveImportPath: (_, libPath) => libPath,
      widgets,
    })(""),
  );

  Object.assign(files, extraFiles);

  for (const transform of codeTransformers) {
    for (const [path, content] of Object.entries(files)) {
      files[path] = transform(path, content);
    }
  }

  return files;
}
