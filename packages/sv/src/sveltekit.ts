import { sveltekitPackage, svelteKitSubPath, svelteKitRfSubPath } from "meta";

import { isEndsWithPrecompiled, type Context } from "./model.js";
import { createPrinter, transforms } from "./sv-utils.js";

export function sveltekitTs(ctx: Context) {
  const {
    isKit,
    options: { sveltekit, validatorWithSuffix },
    directory,
    language,
    sv,
  } = ctx;
  if (!isKit || sveltekit === "no") {
    return;
  }

  const [isPrecompiled] = createPrinter(
    isEndsWithPrecompiled(validatorWithSuffix),
  );

  const setup = (
    {
      formActions: {
        filename: `+page.server.${language}`,
        code: `import type { Actions } from "@sveltejs/kit";
import type { InitialFormData } from "${sveltekitPackage.name}";
import { createAction } from "${svelteKitSubPath("server")}";

import { schema, type CreatePost } from "$lib/post";
import * as defaults from "$lib/sjsf/defaults";

export const load = async () => {
  return {
    postForm: {
      schema,
      initialValue: { title: "New post", content: "" },
    } satisfies InitialFormData<CreatePost>,
  };
};

export const actions = {
  default: createAction(
    {
      ...defaults,
      name: "postForm",
      schema,
      sendData: true,
    },
    ({ title, content }: CreatePost) => {
      // Your logic here
      return { post: { id: "new-post", title, content } };
    },
  ),
} satisfies Actions;
`,
      },
      remoteFunctions: { filename: `data.remote.${language}`, code: "" },
    } satisfies Record<typeof sveltekit, { filename: string; code: string }>
  )[sveltekit];

  sv.file(
    `${directory.kitRoutes}/${setup.filename}`,
    transforms.script(({ ast, comments, js }) => {
      js.common.appendFromString(ast, {
        comments,
        code: setup.code,
      });
    }),
  );
}
