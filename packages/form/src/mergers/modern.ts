import {
  createMerger as createJsonSchemaMerger,
  createShallowAllOfMerge,
} from "@/lib/json-schema/index.js";
import {
  getDefaultFormState,
  type Experimental_DefaultFormStateBehavior,
  type Merger,
  type Validator,
} from "@/core/index.js";
import type { FormMerger, Schema } from "@/form/main.js";

export interface MergerOptions {
  jsonSchemaMerger?: ReturnType<typeof createJsonSchemaMerger>;
  jsonSchemaAllOfMerge?: ReturnType<typeof createShallowAllOfMerge>;
}

export function createMerger({
  jsonSchemaMerger: {
    mergeSchemaDefinitions,
    mergeArrayOfSchemaDefinitions,
  } = createJsonSchemaMerger(),
  jsonSchemaAllOfMerge = createShallowAllOfMerge(mergeArrayOfSchemaDefinitions),
}: MergerOptions = {}): Merger {
  return {
    mergeSchemas(a, b) {
      return mergeSchemaDefinitions(a, b) as Schema;
    },
    mergeAllOf(schema) {
      return jsonSchemaAllOfMerge(schema) as Schema;
    },
  };
}

export interface FormMergerOptions
  extends Experimental_DefaultFormStateBehavior,
    MergerOptions {
  validator: Validator;
  schema: Schema;
}

export function createFormMerger(options: FormMergerOptions): FormMerger {
  const merger = createMerger(options);
  return {
    ...merger,
    mergeFormDataAndSchemaDefaults({
      formData,
      schema,
      initialDefaultsGenerated = false,
      includeUndefinedValues = false
    }) {
      return getDefaultFormState(
        options.validator,
        merger,
        schema,
        formData,
        options.schema,
        includeUndefinedValues,
        options,
        initialDefaultsGenerated
      );
    },
  };
}
