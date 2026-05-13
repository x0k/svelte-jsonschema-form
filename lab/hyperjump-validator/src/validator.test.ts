import {
  registerSchema,
  unregisterSchema,
  type SchemaObject,
} from "@hyperjump/json-schema/draft-07";
import {
  getSchema,
  Validation,
  type AST,
} from "@hyperjump/json-schema/experimental";
import {
  createValidatorRetriever,
  fragmentSchema,
  type IdFactory,
} from "@sjsf/form/validators/precompile";
import {
  createPrecompiledValidatorFactory,
  formValueValidatorTests,
  validatorTests,
} from "validator-testing";

import { createFormValidatorFactory } from "./validator.js";
import { localization } from "./localizations/en-us.js";

const toId = (n: number) => `https://example.com/v${n}`;
const createIdFactory = (): IdFactory => {
  let id = 0;
  return () => toId(id++);
};

const createFormValidator = createPrecompiledValidatorFactory(
  async (options) => {
    const schemas = fragmentSchema(options.patch);
    for (const schema of schemas) {
      registerSchema(
        Object.assign(
          { $schema: "http://json-schema.org/draft-07/schema" },
          schema as SchemaObject,
        ),
      );
    }
    try {
      // https://github.com/hyperjump-io/json-schema/issues/116
      const ast = { metaData: {}, plugins: new Set() } as unknown as AST;
      for (const schema of schemas) {
        const s = await getSchema(schema.$id!);
        await Validation.compile(s, ast, s);
      }
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
      return factory(options);
    } finally {
      for (const s of schemas) {
        unregisterSchema(s.$id!);
      }
    }
  },
);

validatorTests(createFormValidator, { createIdFactory });
formValueValidatorTests(createFormValidator, { createIdFactory });
