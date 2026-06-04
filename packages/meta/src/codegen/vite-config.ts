import { transforms } from "@sveltejs/sv-utils";
import type { CodegenThemeOrSubTheme } from "./model.ts";

export interface ViteConfigOptions {
  themeOrSubTheme: CodegenThemeOrSubTheme;
}

export function createViteConfig({ themeOrSubTheme }: ViteConfigOptions) {
  return transforms.script(({ ast, js }) => {
    if (themeOrSubTheme !== "shadcn-extras") {
      return false;
    }
    const config = js.vite.getConfig(ast);
    js.vite.configProperty(ast, config, {
      name: "ssr",
      fallback: js.object.create({ noExternal: ["@lucide/svelte"] }),
    });
  });
}
