import { transforms } from "@sveltejs/sv-utils";

import {
  sveltekitPackage,
  svelteKitRfSubPath,
  svelteKitSubPath,
} from "../sveltekit.ts";

import type {
  ConditionalPrinter,
  CodegenSvelteKitIntegration,
  PathFactory,
} from "./model.ts";
import {
  schemaAndValidatorProp,
  type ValidatorDefinition,
} from "./validator.ts";
import { renderImports } from "./lib.ts";

export interface SvelteKitIntegrationOptions {
  validator: ValidatorDefinition;
  lib: PathFactory;
  isTs: boolean;
  modelName: string;
  sveltekit: Exclude<CodegenSvelteKitIntegration, "no">;
  ts: ConditionalPrinter;
}

export function createSvelteKitIntegration({
  validator,
  sveltekit,
  lib,
  ts,
  isTs,
  modelName,
}: SvelteKitIntegrationOptions) {
  const validatorImports = renderImports(
    validator.imports.concat(validator.schemaImports),
  );
  const isInputTypeRequired = isTs && !validator.canInferFormType;
  const inputType = `${modelName}.Model`;
  const validatorProps = schemaAndValidatorProp(modelName, validator);
  const setup = (
    {
      formActions: {
        filename: `+page.server`,
        code: `${ts(`import type { Actions } from "@sveltejs/kit";
import type { InitialFormData } from "${sveltekitPackage.name}";\n`)}import { createAction } from "${svelteKitSubPath("server")}";
${validatorImports};
import * as defaults from "${lib("sjsf/defaults")}";

export const load = async () => {
  return {
    postForm: {
      ...${modelName},
    }${ts(` satisfies InitialFormData<${inputType}>`)},
  };
};

export const actions = {
  default: createAction(
    {
      ...defaults,
      ${validatorProps}
      name: "postForm",
      sendData: true,
    },
    (data${isInputTypeRequired ? `: ${inputType}` : ""}) => {
      console.log(data)
      return { post: { ...data, id: "new-post" } };
    },
  ),
}${ts(" satisfies Actions")};
`,
      },
      remoteFunctions: {
        filename: `data.remote`,
        code: `${ts(`import type { InitialFormData } from "${sveltekitPackage.name}";\n`)}import { createServerValidator } from "${svelteKitRfSubPath("server")}";

import { form, query } from "$app/server";
${validatorImports};
import * as defaults from "${lib("sjsf/defaults")}";

export const getInitialData = query(async () => {
  return {
    ...${modelName},
  }${ts(` satisfies InitialFormData<${inputType}>`)};
});

export const createPost = form(
  createServerValidator${isInputTypeRequired ? `<${inputType}>` : ""}({
    ...defaults,
    ${validatorProps}
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
  return {
    filename: setup.filename,
    transform: transforms.script(({ ast, comments, js }) => {
      js.common.appendFromString(ast, {
        comments,
        code: setup.code,
      });
    }),
  };
}
