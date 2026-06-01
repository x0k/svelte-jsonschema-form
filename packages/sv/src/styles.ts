import { isThemeExtension, themeExtensionOrigin, toTheme } from "meta";
import {
  createStyles,
  isStyleSheetEmpty,
  setupShadcnContext,
  svelteWrapFragment,
} from "meta/codegen";

import type { Context } from "./model.js";
import {
  type SvelteAst,
  transforms,
  js as jsUtils,
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
    dependencyVersion,
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

  // Connect stylesheet
  // https://github.com/sveltejs/cli/blob/a260374df2f24d440eb6f25841dcc89278a8e00d/packages/sv/src/addons/tailwindcss.ts#L84
  sv.file(
    layoutSvelte,
    transforms.svelteScript({ language }, ({ ast, svelte, js }) => {
      connectStylesheet(ctx, ast.instance, js, layoutSvelte);
      const themeOrExtension = toTheme(themeOrSubTheme);
      const theme = isThemeExtension(themeOrExtension)
        ? themeExtensionOrigin(themeOrExtension)
        : themeOrExtension;
      if (theme === "shadcn4") {
        setupShadcnContext({ instance: ast.instance, js, lib, theme });
      }

      if (isKit) {
        if (ast.fragment.nodes.length === 0) {
          const svelteVersion = dependencyVersion("svelte");
          if (!svelteVersion)
            throw new Error("Failed to determine svelte version");
          svelte.addSlot(ast, { svelteVersion });
        }
      }

      if (themeOrSubTheme === "svar") {
        js.imports.addNamed(ast.instance.content, {
          imports: ["Willow"],
          from: "@svar-ui/svelte-core",
        });
        svelteWrapFragment(ast, {
          wrapper: "Willow",
        });
      } else if (themeOrSubTheme === "beercss") {
        js.imports.addEmpty(ast.instance.content, {
          from: "beercss/dist/cdn/beer.css",
        });
      }
    }),
  );
}

function connectStylesheet(
  { cwd, file }: Context,
  instance: SvelteAst.Script,
  js: typeof jsUtils,
  layoutSvelte: string,
) {
  if (!fileExists(cwd, file.stylesheet)) {
    return;
  }
  const stylesheetRelative = file.getRelative({
    from: layoutSvelte,
    to: file.stylesheet,
  });
  js.imports.addEmpty(instance.content, {
    from: stylesheetRelative,
  });
}
