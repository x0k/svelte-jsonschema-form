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

const createPostType = {
  inputType: "CreatePost",
  isSchemaBased: true,
};

function createPost({
  options: { validatorWithSuffix },
  ts,
  directory,
}: Context): {
  imports: string;
  options: string;
  inputType: string;
  isSchemaBased: boolean;
} {
  if (isEndsWithPrecompiled(validatorWithSuffix)) {
    const validator = withoutPrecompiledSuffix(validatorWithSuffix);
    if (validator === "hyperjump") {
      return {
        ...createPostType,
        imports: `import { createFormValidatorFactory } from "${precompiledValidatorSubPath(validator)}";
import { localization } from "${hyperjumpValidatorLocalizationSubPath("en-us")}";

import { schema${ts(", type CreatePost")} } from "${directory.lib}/post/post.generated";
import { ast } from "${directory.lib}/post/post.ast"`,
        options: `schema,
validator: createFormValidatorFactory({ ast, localization })`,
      };
    }
    return {
      ...createPostType,
      imports: `import { createFormValidatorFactory } from "${precompiledValidatorSubPath(validator)}";

import { schema${ts(", type CreatePost")} } from "${directory.lib}/post/post.generated";
import * as validateFunctions from "${directory.lib}/post/post.validators"`,
      options: `schema,
validator: createFormValidatorFactory({ validateFunctions })`,
    };
  }
  if (isSchemaValidator(validatorWithSuffix)) {
    const v = (
      {
        zod4: {
          import: 'import * as z from "zod"',
          path: zod4ValidatorVersionSubPath("classic"),
          inferInput: "z.infer",
        },
        valibot: {
          import: 'import * as v from "valibot"',
          path: externalValidatorPackage("valibot").name,
          inferInput: "v.InferInput",
        },
        "standard-schema": {
          import:
            'import type { StandardSchemaV1 } from "@standard-schema/spec"',
          path: internalValidatorSubPath("standard-schema"),
          inferInput: "StandardSchemaV1.InferInput",
        },
      } satisfies Record<
        typeof validatorWithSuffix,
        {
          import: string;
          path: string;
          inferInput: string;
        }
      >
    )[validatorWithSuffix];
    return {
      imports: `${v.import};
import { adapt } from "${v.path}";
      
import { post } from "${directory.lib}/post"`,
      options: `...adapt(post)`,
      inputType: `${v.inferInput}<typeof post>`,
      isSchemaBased: false,
    };
  }
  return {
    ...createPostType,
    imports: `import { schema${ts(", type CreatePost")} } from "${directory.lib}/post"`,
    options: "schema",
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
    isTs,
  } = ctx;
  if (!isKit || sveltekit === "no") {
    return;
  }

  const post = createPost(ctx);

  const setup = (
    {
      formActions: {
        filename: `+page.server`,
        code: `${ts(`import type { Actions } from "@sveltejs/kit";
import type { InitialFormData } from "${sveltekitPackage.name}";\n`)}import { createAction } from "${svelteKitSubPath("server")}";
${post.imports};
import * as defaults from "${directory.lib}/sjsf/defaults";

export const load = async () => {
  return {
    postForm: {
      ${post.isSchemaBased ? "schema," : ""}
      initialValue: { title: "New post", content: "" },
    }${ts(` satisfies InitialFormData<${post.inputType}>`)},
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
    (post${isTs && post.isSchemaBased ? `: ${post.inputType}` : ""}) => {
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
${post.imports};
import * as defaults from "${directory.lib}/sjsf/defaults";

export const getInitialData = query(async () => {
  return {
    ${post.isSchemaBased ? "schema, " : ""}
    initialValue: { title: "New post", content: "" },
  }${ts(` satisfies InitialFormData<${post.inputType}>`)};
});

export const createPost = form(
  createServerValidator${isTs && post.isSchemaBased ? `<${post.inputType}>` : ""}({
    ...defaults,
    ${post.options}
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
    `${directory.kitRoutes}/${setup.filename}.${language}`,
    transforms.script(({ ast, comments, js }) => {
      js.common.appendFromString(ast, {
        comments,
        code: setup.code,
      });
    }),
  );
}
