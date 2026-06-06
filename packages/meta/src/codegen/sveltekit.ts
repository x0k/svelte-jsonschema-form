import type { FormValue, UiSchemaRoot } from "@sjsf/form";
import { isRecordEmpty } from "@sjsf/form/lib/object";
import { transforms } from "@sveltejs/sv-utils";

import {
  sveltekitPackage,
  svelteKitRfSubPath,
  svelteKitSubPath,
} from "../sveltekit.ts";

import type {
  ConditionalPrinter,
  CodegenSvelteKitIntegration,
  FieldsValidationMode,
} from "./model.ts";
import { createValidator, type ValidatorOptions } from "./validator.ts";
import { renderImports } from "./lib.ts";

export interface SvelteKitIntegrationOptions extends ValidatorOptions {
  sveltekit: Exclude<CodegenSvelteKitIntegration, "no">;
  ts: ConditionalPrinter;
  uiSchema: UiSchemaRoot;
  initialValue: FormValue;
  fieldsValidationMode: FieldsValidationMode;
}

export function createSvelteKitIntegration(
  options: SvelteKitIntegrationOptions,
) {
  const validator = createValidator(options);
  const validatorImports = renderImports(
    validator.imports.concat(validator.schemaImports),
  );
  const {
    sveltekit,
    lib,
    ts,
    isTs,
    modelName,
    uiSchema,
    initialValue,
    fieldsValidationMode,
  } = options;
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
      ${!validator.canInferFormType ? `schema: ${modelName}.schema,` : ""}
      ${!isRecordEmpty(uiSchema) ? `uiSchema: ${modelName}.uiSchema,` : ""}
      ${initialValue !== undefined ? `initialValue: ${modelName}.initialValue,` : ""}
      ${fieldsValidationMode > 0 ? `fieldsValidationMode: ${modelName}.fieldsValidationMode,` : ""}
    }${ts(` satisfies InitialFormData<${validator.inputType}>`)},
  };
};

export const actions = {
  default: createAction(
    {
      ...defaults,
      name: "postForm",
      sendData: true,
      ${validator.options}
    },
    (data${isTs && !validator.canInferFormType ? `: ${validator.inputType}` : ""}) => {
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
    ${!validator.canInferFormType ? `schema: ${modelName}.schema, ` : ""}
    ${!isRecordEmpty(uiSchema) ? `uiSchema: ${modelName}.uiSchema,` : ""}
    ${initialValue !== undefined ? `initialValue: ${modelName}.initialValue,` : ""}
    ${fieldsValidationMode !== 0 ? `fieldsValidationMode: ${modelName}.fieldsValidationMode,` : ""}
  }${ts(` satisfies InitialFormData<${validator.inputType}>`)};
});

export const createPost = form(
  createServerValidator${isTs && !validator.canInferFormType ? `<${validator.inputType}>` : ""}({
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
