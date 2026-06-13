import { transforms, type SvelteAst } from "@sveltejs/sv-utils";

import type { CodegenThemeOrSubTheme } from "./model.ts";

export interface AppHtmlOptions {
  themeOrSubTheme: CodegenThemeOrSubTheme;
}

export function createAppHtml({ themeOrSubTheme }: AppHtmlOptions) {
  // https://github.com/sveltejs/cli/blob/19ed7a0f940816a63c1c7f963a04bb72d7b19a8f/packages/sv/src/addons/paraglide.ts#L148
  return transforms.html(({ ast, html }) => {
    if (themeOrSubTheme !== "skeleton4") {
      return false;
    }
    const htmlNode = ast.nodes.find(
      (child): child is SvelteAst.RegularElement =>
        child.type === "RegularElement" && child.name === "html",
    );
    if (!htmlNode) {
      console.warn(
        "Could not find <html> node in app.html. You'll need to add the language placeholder manually",
      );
      return false;
    }
    html.addAttribute(htmlNode, "data-theme", "cerberus");
  });
}
