import { transforms } from "@sveltejs/sv-utils";

import { isThemeExtension, themeExtensionOrigin, toTheme } from "../themes.ts";

import { svelteWrapFragment } from "./lib.ts";
import type { CodegenThemeOrSubTheme, PathFactory } from "./model.ts";
import { setupShadcnContext } from "./shadcn-context.ts";

export interface CreateLayoutOptions {
  language: "ts" | "js";
  themeOrSubTheme: CodegenThemeOrSubTheme;
  lib: PathFactory;
  isKit: boolean;
  svelteVersion?: string;
  stylesheetPath?: string;
}

export function createLayout({
  svelteVersion = "5",
  language,
  stylesheetPath,
  lib,
  isKit,
  themeOrSubTheme,
}: CreateLayoutOptions) {
  return transforms.svelteScript({ language }, (file) => {
    const { ast, svelte, js } = file;

    if (stylesheetPath) {
      js.imports.addEmpty(ast.instance.content, {
        from: stylesheetPath,
      });
    }

    const themeOrExtension = toTheme(themeOrSubTheme);
    const theme = isThemeExtension(themeOrExtension)
      ? themeExtensionOrigin(themeOrExtension)
      : themeOrExtension;

    if (theme === "shadcn4") {
      setupShadcnContext({
        instance: ast.instance,
        js,
        lib,
        theme,
      });
    }

    if (isKit && ast.fragment.nodes.length === 0) {
      svelte.addSlot(ast, { svelteVersion });
    }

    if (themeOrSubTheme === "svar") {
      js.imports.addNamed(ast.instance.content, {
        imports: ["Willow"],
        from: "@svar-ui/svelte-core",
      });
      svelteWrapFragment(ast, { wrapper: "Willow" });
    } else if (themeOrSubTheme === "beercss") {
      js.imports.addEmpty(ast.instance.content, {
        from: "beercss/dist/cdn/beer.css",
      });
    }
  });
}
