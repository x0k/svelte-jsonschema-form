import type { UiSchemaRoot, FormValue } from "@sjsf/form";
import type { DeepPartial } from "@sjsf/form/lib/types";

import {
  type CodegenThemeOrSubTheme,
  type CodegenIconSet,
  type CodegenSvelteKitIntegration,
  type FieldsValidationMode,
  type Language,
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
  KIT_PATH_FACTORY,
  type MergerOptions,
  type ModuleAugmentation,
  type ThemeExtension,
  type UiOptionsRegistryEntry,
  createPrinter,
  createValidator,
  createForm,
  type CodegenValidator,
  type TypedSchema,
} from "../codegen/index.ts";
import type { ExtraFieldFileName } from "../fields.ts";
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
  validator: CodegenValidator;
  sveltekit: CodegenSvelteKitIntegration;
  widgets: ExtraWidgetFileNames[ToTheme<T>][];
  fields: ExtraFieldFileName[];
  extraFiles: Record<string, string>;
  extraDependencies: AbstractPackage[];
  codeTransformers: CodeTransformer[];
  modelName: string;
  uiSchema: UiSchemaRoot;
  /** If `undefined` is specified, the model file will not be generated */
  schema: TypedSchema | undefined;
  initialValue: FormValue;
  fieldsValidationMode: FieldsValidationMode;
  disabled: boolean;
  merger: DeepPartial<MergerOptions>;
  uiOptionsRegistry: Record<string, UiOptionsRegistryEntry>;
  themeExtension: ThemeExtension;
  moduleAugmentation: Partial<ModuleAugmentation>;
  omitExtraData: boolean;
  focusOnFirstError: boolean;
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
  2
);

const APP_HTML = `<!DOCTYPE html>
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

export function normalizeProjectName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function createComposer<T extends CodegenThemeOrSubTheme>(
  options: ComposerOptions<T>
): Promise<Record<string, string>> {
  const {
    name,
    language,
    themeOrSubTheme,
    icons,
    validator,
    sveltekit,
    widgets,
    fields,
    extraFiles,
    extraDependencies,
    codeTransformers,
    modelName,
    fieldsValidationMode,
    schema,
    uiSchema,
    initialValue,
    disabled,
    merger,
    uiOptionsRegistry,
    themeExtension,
    moduleAugmentation,
    omitExtraData,
    focusOnFirstError,
  } = options;
  const isKit = true;
  const nodeModulesPath = "../../node_modules";
  const isTs = language === "ts";
  const ts = createPrinter(isTs);
  const js = createPrinter(!isTs);
  const lib = KIT_PATH_FACTORY;

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
    validator,
    icons,
    sveltekit,
    widgets,
  });

  const validatorDefinition = createValidator({
    validator,
    isTs,
    lib,
    modelName,
  });

  const form = createForm({
    validator: validatorDefinition,
    disabled,
    isTs,
    modelName,
    sveltekit,
    omitExtraData,
  });

  const files: Record<string, string> = {
    "package.json": buildPackageJson({
      name: normalizeProjectName(name),
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
      validator,
      icons,
      resolver: "basic",
      sveltekit,
      widgets,
      fields,
      isTs,
      ts,
      js,
      lib,
      modelName,
      merger,
      focusOnFirstError,
      themeExtension,
      moduleAugmentation,
      uiOptionsRegistry,
    })(""),
    "src/routes/+page.svelte": createPage({
      language,
      themeOrSubTheme,
      validator,
      lib,
      form,
    })(""),
  };

  if (schema && !validator.precompiled) {
    files[`src/lib/${modelName}.${language}`] = (
      await createModel({
        validator,
        isTs,
        ts,
        schema,
        uiSchema,
        initialValue,
        fieldsValidationMode,
      })
    )("");
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
    })("")
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
    })("")
  );

  Object.assign(files, extraFiles);

  for (const transform of codeTransformers) {
    for (const [path, content] of Object.entries(files)) {
      files[path] = transform(path, content);
    }
  }

  return files;
}
