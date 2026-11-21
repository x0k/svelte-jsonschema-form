import {
  createCoreContext,
  getDefaultFormState,
  type ValueHandler,
  type DefaultFormStateBehavior,
  type Logger,
  type Merger,
  type Validator,
} from "#core/index.js";
import type { FormMerger, Schema } from "#form/main.js";
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
  extends DefaultFormStateBehavior, MergerOptions {
  validator: Validator;
  schema: Schema;
  valueHandler: ValueHandler;
  logger: Logger;
}

export function createFormMerger(options: FormMergerOptions): FormMerger {
  const formMerger: FormMerger = {
    ...createMerger(options),
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
          valueHandler: options.valueHandler,
          rootSchema: options.schema,
          logger: options.logger,
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
