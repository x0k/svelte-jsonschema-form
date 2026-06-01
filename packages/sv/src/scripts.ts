import {
  createCompileValidatorsScript,
  isEndsWithPrecompiled,
} from "meta/codegen";

import { POST_JSON_SCHEMA_PATH, type Context } from "./model.js";
import { transforms } from "./sv-utils.js";

export function scriptsFolder(ctx: Context) {
  const {
    options: { validatorWithSuffix, demo },
    file,
    language,
    sv,
    ts,
    directory,
  } = ctx;
  if (!demo || !isEndsWithPrecompiled(validatorWithSuffix)) {
    return;
  }

  sv.file(
    `scripts/compile-validators.${language}`,
    createCompileValidatorsScript({
      validator: validatorWithSuffix,
      jsonSchemaPaths: [`${directory.lib}${POST_JSON_SCHEMA_PATH}`],
      language,
      ts,
    }),
  );

  sv.file(
    file.package,
    transforms.json(({ data, json }) => {
      json.packageScriptsUpsert(
        data,
        "sjsf:compile",
        `node scripts/compile-validators.${language}`,
      );
      json.packageScriptsUpsert(data, "prepare", "npm run sjsf:compile");
    }),
  );
}
