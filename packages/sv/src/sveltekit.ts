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
  sendSchema: true,
};

function createPost({
  options: { validatorWithSuffix },
  ts,
  directory,
}: Context): {
  imports: string;
  options: string;
  inputType: string;
  sendSchema: boolean;
} {
  if (isEndsWithPrecompiled(validatorWithSuffix)) {
    const validator = withoutPrecompiledSuffix(validatorWithSuffix);
    if (validator === "hyperjump") {
      return {
        ...createPostType,
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
          inputType: "z.infer<typeof post>",
        },
        valibot: {
          import: 'import * as v from "valibot"',
          path: externalValidatorPackage("valibot").name,
          inputType: "v.InferInput<typeof post>",
        },
        "standard-schema": {
          import:
            'import type { StandardSchemaV1 } from "@standard-schema/spec"',
          path: internalValidatorSubPath("standard-schema"),
          inputType: "StandardSchemaV1.InferInput<typeof post>",
        },
      } satisfies Record<
        typeof validatorWithSuffix,
        {
          import: string;
          path: string;
          inputType: string;
        }
      >
    )[validatorWithSuffix];
    return {
      imports: `${v.import};
import { adapt } from "${v.path}";
      
import { post } from "${directory.lib}/post"`,
      options: `...adapt(post)`,
      inputType: v.inputType,
      sendSchema: false,
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
        filename: `+page.server.${language}`,
        code: `${ts(`import type { Actions } from "@sveltejs/kit";
import type { InitialFormData } from "${sveltekitPackage.name}";\n`)}import { createAction } from "${svelteKitSubPath("server")}";
${post.imports};
import * as defaults from "${directory.lib}/sjsf/defaults";

export const load = async () => {
  return {
    postForm: {
      ${post.sendSchema ? "schema," : ""}
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
    ({ title, content }${isTs && post.sendSchema ? ": CreatePost" : ""}) => {
      // Your logic here
      return { post: { id: "new-post", title, content } };
    },
  ),
}${ts(" satisfies Actions")};
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
