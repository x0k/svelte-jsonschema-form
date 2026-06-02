import {
  type NamespaceImportOptions,
  type CodegenThemeOrSubTheme,
  type CodegenIconSet,
  type CodegenValidator,
  type CodegenSvelteKitIntegration,
  type ConditionalPrinter,
  type Language,
  type PathFactory,
  createAddTailwind4Css,
  createDefaults,
  createLayout,
  createPage,
  createStyles,
  createSvelteKitIntegration,
  resolveDependencies,
} from "../codegen/index.ts";
import type { AtRule } from "../css.ts";
import type { AbstractPackage } from "../package.ts";

import { buildPackageJson } from "./package-json.ts";
import { buildSvelteConfig } from "./svelte-config.ts";
import { buildViteConfig, type VitePluginConfig } from "./vite-config.ts";

export type CodeTransformer = (filepath: string, code: string) => string;

export interface ComposerOptions {
  name: string;
  language: Language;
  themeOrSubTheme: CodegenThemeOrSubTheme;
  icons: CodegenIconSet;
  validatorWithSuffix: CodegenValidator;
  sveltekit: CodegenSvelteKitIntegration;
  extraFiles?: Record<string, string>;
  extraDependencies?: AbstractPackage[];
  codeTransformers?: CodeTransformer[];
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

const LAYOUT = `<script lang="ts">
  import type { Snippet } from 'svelte';

  const { children }: { children: Snippet } = $props()
</script>

{@render children()}
`;

export function createComposer(
  options: ComposerOptions,
): Record<string, string> {
  const {
    name,
    language,
    themeOrSubTheme,
    icons,
    validatorWithSuffix,
    sveltekit,
    extraFiles,
    extraDependencies,
    codeTransformers,
  } = options;
  const isKit = true;
  const nodeModulesPath = "../../node_modules";
  const isTs = language === "ts";
  const ts: ConditionalPrinter = (content, alt = "") => (isTs ? content : alt);
  const lib: PathFactory = (path) => `$lib/${path}`;

  const dependencies: AbstractPackage[] = [];
  const vitePlugins: Record<string, VitePluginConfig> = {};
  const appCssRules: AtRule[] = [];

  const addDependency = (pkg: AbstractPackage) => {
    dependencies.push(pkg);
  };

  const addVitePlugin = ({ as, from }: NamespaceImportOptions) => {
    vitePlugins[from] = {
      import: as,
      call: `${as}()`,
    };
  };

  const addAppCssRule = (rule: AtRule) => {
    appCssRules.push(rule);
  };

  const addTailwind4Css = createAddTailwind4Css({
    addDependency,
    addVitePlugin,
    addAppCssRule,
  });

  resolveDependencies({
    addDependency,
    addTailwindCss4: addTailwind4Css,
    themeOrSubTheme,
    validatorWithSuffix,
    icons,
    sveltekit,
  });

  vitePlugins["@sveltejs/kit/vite"] = {
    import: "{ sveltekit }",
    call: "sveltekit()",
  };

  if (extraDependencies) {
    for (const dep of extraDependencies) {
      dependencies.push(dep);
    }
  }

  const files: Record<string, string> = {
    "package.json": buildPackageJson({ name, dependencies }),
    "vite.config.js": buildViteConfig({ plugins: vitePlugins }),
    "svelte.config.js": buildSvelteConfig({}),
    "tsconfig.json": TSCONFIG,
    "src/app.html": APP_HTML,
    "src/routes/+layout.svelte": createLayout({
      language,
      themeOrSubTheme,
      lib,
      isKit,
      stylesheetPath: "./layout.css",
    })(LAYOUT),
  };

  files["src/lib/sjsf/defaults.ts"] = createDefaults({
    themeOrSubTheme,
    validatorWithSuffix,
    icons,
    sveltekit,
    isTs,
    ts,
  })("");

  files["src/routes/+page.svelte"] = createPage({
    language,
    themeOrSubTheme,
    validatorWithSuffix,
    sveltekit,
    isTs,
    lib,
  })("");

  files["src/routes/layout.css"] = createStyles({
    nodeModulesPath,
    themeOrSubTheme,
    icons,
  })("");

  if (sveltekit !== "no") {
    const { filename, transform } = createSvelteKitIntegration({
      sveltekit,
      validatorWithSuffix,
      isTs,
      lib,
      ts,
    });
    files[`src/routes/${filename}.${language}`] = transform("");
  }

  if (extraFiles) {
    Object.assign(files, extraFiles);
  }

  if (codeTransformers) {
    for (const transform of codeTransformers) {
      for (const [path, content] of Object.entries(files)) {
        files[path] = transform(path, content);
      }
    }
  }

  return files;
}
