import { createJsonFile, createModel } from "meta/codegen";

import {
  POST_FIELDS_VALIDATION_MODE,
  POST_INITIAL_VALUE,
  POST_MODEL_DIR,
  POST_SCHEMA,
  POST_UI_SCHEMA,
  POST_VALIBOT_SCHEMA,
  POST_ZOD_SCHEMA,
  type Context,
} from "./model.js";

export async function postTs({
  isTs,
  sv,
  directory,
  language,
  options: { validator, demo },
  ts,
}: Context) {
  if (!demo) {
    return;
  }

  if (validator.precompiled) {
    const modelDir = `${directory.lib}${POST_MODEL_DIR}`;
    sv.file(`${modelDir}schema.json`, createJsonFile(POST_SCHEMA));
    sv.file(`${modelDir}ui-schema.json`, createJsonFile(POST_UI_SCHEMA));
    sv.file(
      `${modelDir}initial-value.json`,
      createJsonFile(POST_INITIAL_VALUE)
    );
  } else {
    const modelTransform = await createModel({
      validator,
      ts,
      schema:
        validator.name === "zod4"
          ? POST_ZOD_SCHEMA
          : validator.name === "valibot"
            ? POST_VALIBOT_SCHEMA
            : JSON.stringify(POST_SCHEMA),
      isTs,
      initialValue: POST_INITIAL_VALUE,
      uiSchema: POST_UI_SCHEMA,
      fieldsValidationMode: POST_FIELDS_VALIDATION_MODE,
    });
    sv.file(`${directory.lib}/post.${language}`, modelTransform);
  }
}
