import {
  registerSchema,
  unregisterSchema,
  type SchemaObject,
} from "@hyperjump/json-schema/draft-07";
import { compile, getSchema } from "@hyperjump/json-schema/experimental";
import {
  createValidatorRetriever,
  fragmentSchema,
  insertSubSchemaIds,
} from "@sjsf/form/validators/precompile";
import { formValueValidatorTests } from "validator-testing";

import { createFormValidatorFactory } from "./validator.js";
import { localization } from "./localizations/en-us.js";

formValueValidatorTests((options) => ({
  isValid: () => {
    throw new Error("'isValid' is not implemented");
  },
  async validateFormValueAsync(_signal, rootSchema, formValue) {
    let id = 0;
    const toId = (n: number) => `https://example.com/v${n}`;
    const patch = insertSubSchemaIds(rootSchema, {
      createId: () => toId(id++),
    });
    const schemas = fragmentSchema(patch);
    for (const schema of schemas) {
      registerSchema(
        Object.assign(
          Object.assign(
            { $schema: "http://json-schema.org/draft-07/schema" },
            schema as SchemaObject,
          ),
        ),
      );
    }
    try {
      const { ast } = await compile(await getSchema(toId(0)));
      const factory = createFormValidatorFactory({
        localization,
        validatorRetriever: createValidatorRetriever({
          registry: {
            get: (id) => {
              const schemaUri = `${id}#`;
              return schemaUri in ast
                ? {
                    schemaUri,
                    ast,
                  }
                : undefined;
            },
          },
        }),
      });
      const v = factory(options);
      return v.validateFormValue(patch.schema, formValue);
    } finally {
      for (const s of schemas) {
        unregisterSchema(s.$id!);
      }
    }
  },
}));
