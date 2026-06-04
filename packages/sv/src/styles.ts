import {
  createAppHtml,
  createLayout,
  createStyles,
  createViteConfig,
  isStyleSheetEmpty,
} from "meta/codegen";

import type { Context } from "./model.js";
import { fileExists, loadFile, parse } from "./sv-utils.js";

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
      sandbox: false,
      preludeRules: [],
    }),
  );

  if (uiLibIsNotConfigured) {
    sv.file("src/app.html", createAppHtml({ themeOrSubTheme }));
    sv.file(file.viteConfig, createViteConfig({ themeOrSubTheme }));
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
