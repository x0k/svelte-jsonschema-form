import { sveltekitPackage, svelteKitSubPath, svelteKitRfSubPath } from "meta";

import { createValidator, type Context } from "./model.js";
import { renderImports, transforms } from "./sv-utils.js";

export function sveltekitTs(ctx: Context) {
  const {
    isKit,
    options: { sveltekit },
    directory,
    language,
    sv,
    ts,
    isTs,
  } = ctx;
  if (!isKit || sveltekit === "no") {
    return;
  }

  const validator = createValidator(ctx);

  const setup = (
    {
      formActions: {
        filename: `+page.server`,
        code: `${ts(`import type { Actions } from "@sveltejs/kit";
import type { InitialFormData } from "${sveltekitPackage.name}";\n`)}import { createAction } from "${svelteKitSubPath("server")}";
${renderImports(validator.imports)};
import * as defaults from "${directory.lib}/sjsf/defaults";

export const load = async () => {
  return {
    postForm: {
      ${validator.sendSchema ? "schema," : ""}
      initialValue: { title: "New post", content: "" },
    }${ts(` satisfies InitialFormData<${validator.inputType}>`)},
  };
};

export const actions = {
  default: createAction(
    {
      ...defaults,
      ${validator.options},
      name: "postForm",
      sendData: true,
    },
    (post${isTs ? `: ${validator.inputType}` : ""}) => {
      console.log(post)
      return { post: { ...post, id: "new-post" } };
    },
  ),
}${ts(" satisfies Actions")};
`,
      },
      remoteFunctions: {
        filename: `data.remote`,
        code: `${ts(`import type { InitialFormData } from "${sveltekitPackage.name}";\n`)}import { createServerValidator } from "${svelteKitRfSubPath("server")}";

import { form, query } from "$app/server";
${renderImports(validator.imports)};
import * as defaults from "${directory.lib}/sjsf/defaults";

export const getInitialData = query(async () => {
  return {
    ${validator.sendSchema ? "schema, " : ""}
    initialValue: { title: "New post", content: "" },
  }${ts(` satisfies InitialFormData<${validator.inputType}>`)};
});

export const createPost = form(
  createServerValidator${isTs ? `<${validator.inputType}>` : ""}({
    ...defaults,
    ${validator.options}
  }),
  ({ data }) => {
    console.log(data);
    return { ...data, id: "new-post" };
  },
);
`,
      },
    } satisfies Record<typeof sveltekit, { filename: string; code: string }>
  )[sveltekit];

  sv.file(
    `${directory.kitRoutes}/demo/sjsf/${setup.filename}.${language}`,
    transforms.script(({ ast, comments, js }) => {
      js.common.appendFromString(ast, {
        comments,
        code: setup.code,
      });
    }),
  );
}
