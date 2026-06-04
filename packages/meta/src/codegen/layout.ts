import { transforms } from "@sveltejs/sv-utils";

import { svelteWrapFragment } from "./lib.ts";
import type { CodegenThemeOrSubTheme, PathFactory } from "./model.ts";
import { setupShadcnContext } from "./shadcn-lib.ts";

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

    setupShadcnContext({
      themeOrSubTheme,
      instance: ast.instance,
      js,
      lib,
    });

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
