import {
  getDefaultFormState,
  isSchemaValueDeepEqual,
  type Experimental_DefaultFormStateBehavior,
  type Merger,
  type Validator,
} from "#core/index.js";
import { dropStaleDefaults } from "#form/drop-stale-defaults.js";
import type {
  DropStaleDefaultsOptions,
  FormMerger,
  Schema,
} from "#form/main.js";
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
    isValueDeepEqual: isSchemaValueDeepEqual,
  };
}

export interface FormMergerOptions
  extends Experimental_DefaultFormStateBehavior, MergerOptions {
  validator: Validator;
  schema: Schema;
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
        options.validator,
        formMerger,
        schema,
        formData,
        options.schema,
        includeUndefinedValues,
        options,
        initialDefaultsGenerated
      );
    },
    dropStaleDefaults(dropOptions: DropStaleDefaultsOptions) {
      return dropStaleDefaults(formMerger, dropOptions);
    },
  };
  return formMerger;
}
