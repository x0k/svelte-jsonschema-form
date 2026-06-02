import type {
  NamespaceImportOptions,
  CodegenThemeOrSubTheme,
  CodegenIconSet,
  CodegenValidator,
  CodegenSvelteKitIntegration,
} from "../codegen/index.ts";
import type { AtRule } from "../css.ts";
import type { AbstractPackage } from "../package.ts";

import { buildPackageJson } from "./package-json.ts";
import { buildSvelteConfig } from "./svelte-config.ts";
import { buildViteConfig, type VitePluginConfig } from "./vite-config.ts";

export interface ComposerOptions {
  name: string;
  themeOrSubTheme: CodegenThemeOrSubTheme;
  icons: CodegenIconSet;
  validator: CodegenValidator;
  sveltekit: CodegenSvelteKitIntegration;
}

export function createComposer({ name, themeOrSubTheme }: ComposerOptions) {
  const dependencies: AbstractPackage[] = [];

  const vitePlugins: Record<string, VitePluginConfig> = {};

  const appCssRules: AtRule[] = [];

  function compose() {
    const files: Record<string, string> = {
      "package.json": buildPackageJson({ name, dependencies }),
      "vite.config.js": buildViteConfig({ plugins: vitePlugins }),
      "svelte.config.js": buildSvelteConfig({}),
    };
    return files;
  }

  function addDependency(pkg: AbstractPackage) {
    dependencies.push(pkg);
  }

  function addVitePlugin({ as, from }: NamespaceImportOptions) {
    vitePlugins[from] = {
      import: as,
      call: `${as}()`,
    };
  }

  function addAppCssRule(rule: AtRule) {
    appCssRules.push(rule);
  }

  return {
    compose,
    addDependency,
    addVitePlugin,
    addAppCssRule,
  };
}
