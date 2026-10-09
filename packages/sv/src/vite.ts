import { createViteConfig } from "meta/codegen";

import type { Context } from "./model.js";

export function viteConfig(ctx: Context) {
  const {
    sv,
    file,
    options: { themeOrSubTheme, icons, sveltekit },
    kit,
  } = ctx;

  sv.file(
    file.viteConfig,
    createViteConfig({
      themeOrSubTheme,
      icons,
      sveltekit,
      sveltekitPackage: kit.pkg,
    })
  );
}
