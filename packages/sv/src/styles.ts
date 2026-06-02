import { createLayout, createStyles, isStyleSheetEmpty } from "meta/codegen";

import type { Context } from "./model.js";
import {
  type SvelteAst,
  transforms,
  fileExists,
  loadFile,
  parse,
} from "./sv-utils.js";

export function appCss(ctx: Context) {
  const {
    file,
    sv,
    options: { themeOrSubTheme, icons },
    isKit,
    directory,
    language,
    cwd,
    lib,
  } = ctx;
  const { ast } = parse.css(loadFile(cwd, file.stylesheet));
  const uiLibIsNotConfigured = isStyleSheetEmpty(ast);
  const nodeModulesPath = file.getRelative({
    from: file.stylesheet,
    to: "node_modules",
  });

  sv.file(
    file.stylesheet,
    createStyles({
      nodeModulesPath,
      icons,
      themeOrSubTheme,
    }),
  );

  if (uiLibIsNotConfigured) {
    if (themeOrSubTheme === "skeleton4") {
      // https://github.com/sveltejs/cli/blob/19ed7a0f940816a63c1c7f963a04bb72d7b19a8f/packages/sv/src/addons/paraglide.ts#L148
      sv.file(
        "src/app.html",
        transforms.html(({ ast, html }) => {
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
        }),
      );
    } else if (themeOrSubTheme === "shadcn-extras") {
      sv.file(
        file.viteConfig,
        transforms.script(({ ast, js }) => {
          const config = js.vite.getConfig(ast);
          js.vite.configProperty(ast, config, {
            name: "ssr",
            fallback: js.object.create({ noExternal: ["@lucide/svelte"] }),
          });
        }),
      );
    }
  }

  const layoutSvelte = isKit
    ? `${directory.kitRoutes}/+layout.svelte`
    : `${directory.src}/App.svelte`;

  const stylesheetPath = fileExists(cwd, file.stylesheet)
    ? file.getRelative({
        from: layoutSvelte,
        to: file.stylesheet,
      })
    : undefined;

  sv.file(
    layoutSvelte,
    createLayout({
      language,
      themeOrSubTheme,
      lib,
      isKit,
      stylesheetPath,
    }),
  );
}
