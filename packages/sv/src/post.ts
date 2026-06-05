import { createModel, isEndsWithPrecompiled, type Schema } from "meta/codegen";

import { POST_JSON_SCHEMA_PATH, type Context } from "./model.js";
import { transforms } from "./sv-utils.js";

const schema = {
  title: "Post",
  type: "object",
  properties: {
    title: {
      title: "Title",
      type: "string",
    },
    content: {
      title: "Content",
      type: "string",
      minLength: 10,
    },
  },
  required: ["title", "content"],
} satisfies Schema;

export function postTs({
  isTs,
  sv,
  directory,
  language,
  options: { validatorWithSuffix, demo },
  ts,
}: Context) {
  if (!demo) {
    return;
  }

  if (isEndsWithPrecompiled(validatorWithSuffix)) {
    sv.file(
      `${directory.lib}${POST_JSON_SCHEMA_PATH}`,
      transforms.json(({ data }) => {
        if (Object.keys(data).length === 0) {
          Object.assign(data, schema);
        }
      }),
    );
  } else {
    sv.file(
      `${directory.lib}/post.${language}`,
      createModel({
        validator: validatorWithSuffix,
        ts,
        schema,
        isTs,
        modelName: "post",
      }),
    );
  }
}
