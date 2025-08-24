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
  includeUndefinedValues?: boolean | "excludeObjectChildren";
}

export function createFormMerger(
  validator: Validator,
  rootSchema: Schema,
  options: FormMergerOptions = {}
): FormMerger {
  const merger = createMerger(options);
  return {
    ...merger,
    mergeFormDataAndSchemaDefaults(formData, schema) {
      return getDefaultFormState(
        validator,
        merger,
        schema,
        formData,
        rootSchema,
        options.includeUndefinedValues,
        options
      );
    },
  };
}
