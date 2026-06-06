import {
  createPage,
  addToDemoPage,
  createValidator,
  createForm,
} from "meta/codegen";

import {
  POST_FIELDS_VALIDATION_MODE,
  POST_INITIAL_VALUE,
  POST_MODEL_NAME,
  POST_UI_SCHEMA,
  type Context,
} from "./model.js";

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

  const validator = createValidator({
    ...ctx.options,
    modelName: POST_MODEL_NAME,
    isTs,
    lib,
  });
  const form = createForm({
    ...ctx.options,
    disabled: false,
    uiSchema: POST_UI_SCHEMA,
    initialValue: POST_INITIAL_VALUE,
    fieldsValidationMode: POST_FIELDS_VALIDATION_MODE,
    isTs,
    modelName: POST_MODEL_NAME,
    validator,
  });
  sv.file(
    `${directory.kitRoutes}/${isKit ? "demo/sjsf/+page.svelte" : "sjsf.svelte"}`,
    createPage({
      ...ctx.options,
      language,
      form,
      lib,
    }),
  );
}
