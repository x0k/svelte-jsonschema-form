import {
  createMerger,
  createShallowAllOfMerge,
} from "@/lib/json-schema/index.js";
import {
  getDefaultFormState,
  type Experimental_DefaultFormStateBehavior,
  type Validator,
} from "@/core/index.js";
import type { FormMerger, Schema } from "@/form/index.js";

export type FormMergerOptions = Experimental_DefaultFormStateBehavior & {
  includeUndefinedValues?: boolean | "excludeObjectChildren";
  jsonSchemaMerger?: ReturnType<typeof createMerger>;
  jsonSchemaAllOfMerge?: ReturnType<typeof createShallowAllOfMerge>;
};

export function createFormMerger(
  validator: Validator,
  rootSchema: Schema,
  {
    includeUndefinedValues,
    jsonSchemaMerger: {
      mergeSchemaDefinitions,
      mergeArrayOfSchemaDefinitions,
    } = createMerger(),
    jsonSchemaAllOfMerge = createShallowAllOfMerge(
      mergeArrayOfSchemaDefinitions
    ),
    ...rest
  }: FormMergerOptions = {}
): FormMerger {
  const merger: FormMerger = {
    mergeSchemas(a, b) {
      return mergeSchemaDefinitions(a, b) as Schema;
    },
    mergeAllOf(schema) {
      return jsonSchemaAllOfMerge(schema) as Schema;
    },
    mergeFormDataAndSchemaDefaults(formData, schema) {
      return getDefaultFormState(
        validator,
        merger,
        schema,
        formData,
        rootSchema,
        includeUndefinedValues,
        rest
      );
    },
  };
  return merger;
}
