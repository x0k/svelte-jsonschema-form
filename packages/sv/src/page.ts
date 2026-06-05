import { createPage, addToDemoPage } from "meta/codegen";

import type { Context } from "./model.js";

export function pageSvelte(ctx: Context) {
  const {
    sv,
    directory,
    language,
    isKit,
    lib,
    isTs,
    options: { demo },
  } = ctx;

  if (!demo) {
    return;
  }

  if (isKit) {
    sv.file(
      `${directory.kitRoutes}/demo/+page.svelte`,
      addToDemoPage("sjsf", language),
    );
  }

  sv.file(
    `${directory.kitRoutes}/${isKit ? "demo/sjsf/+page.svelte" : "sjsf.svelte"}`,
    createPage({ ...ctx.options, language, isTs, lib, modelName: "post" }),
  );
}
