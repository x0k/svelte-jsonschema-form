import { createPage, addToDemoPage } from "meta/codegen";

import { POST_INITIAL_VALUE, POST_UI_SCHEMA, type Context } from "./model.js";

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
    createPage({
      ...ctx.options,
      language,
      isTs,
      lib,
      modelName: "post",
      disabled: false,
      uiSchema: POST_UI_SCHEMA,
      initialValue: POST_INITIAL_VALUE,
    }),
  );
}
