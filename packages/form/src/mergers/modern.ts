import {
  createCoreContext,
  getDefaultFormState,
  type Comparator,
  type Experimental_DefaultFormStateBehavior,
  type Merger,
  type Validator,
} from "#core/index.js";
import type { FormMerger, Schema } from "#form/main.js";
import { copyForChange } from "#form/merger.js";
import {
  createMerger as createJsonSchemaMerger,
  createShallowAllOfMerge,
} from "#lib/json-schema/index.js";

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
  extends Experimental_DefaultFormStateBehavior, MergerOptions {
  validator: Validator;
  schema: Schema;
  comparator: Comparator;
}

export function createFormMerger(options: FormMergerOptions): FormMerger {
  const formMerger: FormMerger = {
    ...createMerger(options),
    copyForChange,
    mergeFormDataAndSchemaDefaults({
      formData,
      schema,
      initialDefaultsGenerated = false,
      includeUndefinedValues = false,
    }) {
      return getDefaultFormState(
        createCoreContext({
          validator: options.validator,
          merger: formMerger,
          comparator: options.comparator,
          rootSchema: options.schema,
        }),
        schema,
        formData,
        includeUndefinedValues,
        options,
        initialDefaultsGenerated
      );
    },
  };
  return formMerger;
}
