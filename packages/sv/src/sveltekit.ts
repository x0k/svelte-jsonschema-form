import {
  sveltekitPackage,
  svelteKitSubPath,
  svelteKitRfSubPath,
  precompiledValidatorSubPath,
  hyperjumpValidatorLocalizationSubPath,
  isSchemaValidator,
  externalValidatorPackage,
  internalValidatorSubPath,
  zod4ValidatorVersionSubPath,
} from "meta";

import {
  isEndsWithPrecompiled,
  withoutPrecompiledSuffix,
  type Context,
} from "./model.js";
import { transforms } from "./sv-utils.js";

function createPost({
  options: { validatorWithSuffix },
  ts,
  directory,
}: Context): {
  imports: string;
  options: string;
} {
  if (isEndsWithPrecompiled(validatorWithSuffix)) {
    const validator = withoutPrecompiledSuffix(validatorWithSuffix);
    if (validator === "hyperjump") {
      return {
        imports: `import { createFormValidatorFactory } from "${precompiledValidatorSubPath(validator)}";
import { localization } from "${hyperjumpValidatorLocalizationSubPath("en-us")}";
import "@hyperjump/json-schema/formats-lite";
import "@hyperjump/json-schema/draft-07";

import { schema${ts(", type CreatePost")} } from "${directory.lib}/post/post.generated";
import { ast } from "${directory.lib}/post/post.ast"`,
        options: `schema,
validator: createFormValidatorFactory({ ast, localization })`,
      };
    }
    return {
      imports: `import { createFormValidatorFactory } from "${precompiledValidatorSubPath(validator)}";

import { schema${ts(", type CreatePost")} } from "${directory.lib}/post/post.generated";
import * as validateFunctions from "${directory.lib}/post/post.validators"`,
      options: `schema,
validator: createFormValidatorFactory({ validateFunctions })`,
    };
  }
  if (isSchemaValidator(validatorWithSuffix)) {
    const paths = {
      zod4: zod4ValidatorVersionSubPath("classic"),
      valibot: externalValidatorPackage("valibot").name,
      "standard-schema": internalValidatorSubPath("standard-schema"),
    } satisfies Record<typeof validatorWithSuffix, string>;
    return {
      imports: `import { adapt } from "${paths[validatorWithSuffix]}";
      
import { post } from "${directory.lib}/post"`,
      options: `...adapt(post)`,
    };
  }
  return {
    imports: "",
    options: "",
  };
}

export function sveltekitTs(ctx: Context) {
  const {
    isKit,
    options: { sveltekit },
    directory,
    language,
    sv,
    ts,
  } = ctx;
  if (!isKit || sveltekit === "no") {
    return;
  }

  const post = createPost(ctx);

  const setup = (
    {
      formActions: {
        filename: `+page.server.${language}`,
        code: `${ts(`import type { Actions } from "@sveltejs/kit";
import type { InitialFormData } from "${sveltekitPackage.name}";\n`)}import { createAction } from "${svelteKitSubPath("server")}";
${post.imports};
import * as defaults from "${directory.lib}/sjsf/defaults";

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
      ${post.options},
      name: "postForm",
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
