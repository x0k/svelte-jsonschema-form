import { createCompileValidatorsScript } from "meta/codegen";

import {
  POST_FIELDS_VALIDATION_MODE,
  POST_MODEL_DIR,
  type Context,
} from "./model.js";
import { transforms } from "./sv-utils.js";

export function scriptsFolder(ctx: Context) {
  const {
    options: { validator, demo },
    file,
    language,
    sv,
    ts,
    directory,
  } = ctx;
  if (!demo || !validator.precompiled) {
    return;
  }

  sv.file(
    `scripts/compile-validators.${language}`,
    createCompileValidatorsScript({
      validator,
      modelPaths: [`${directory.lib}${POST_MODEL_DIR}`],
      language,
      ts,
      fieldsValidationMode: POST_FIELDS_VALIDATION_MODE,
    })
  );

  sv.file(
    file.package,
    transforms.json(({ data, json }) => {
      json.packageScriptsUpsert(
        data,
        "sjsf:compile",
        `node scripts/compile-validators.${language}`
      );
      json.packageScriptsUpsert(data, "prepare", "npm run sjsf:compile");
    })
  );
}
