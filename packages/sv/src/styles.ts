import {
  KIT_PATH_FACTORY,
  createAppHtml,
  createLayout,
  createStyles,
  isStyleSheetEmpty,
  type PathFactory,
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
    }),
  );

  if (uiLibIsNotConfigured) {
    sv.file("src/app.html", createAppHtml({ themeOrSubTheme }));
  }

  const layoutSvelte = isKit
    ? `${directory.kitRoutes}/+layout.svelte`
    : `${directory.src}/App.svelte`;

  const stylesheetPath = fileExists(cwd, file.stylesheet)
    ? file.getRelative({
        from: layoutSvelte,
        to: file.stylesheet,
      })
    : "";

  const lib: PathFactory = isKit
    ? KIT_PATH_FACTORY
    : (path) =>
        file.getRelative({
          from: layoutSvelte,
          to: `${directory.lib}/${path}`,
        });

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
