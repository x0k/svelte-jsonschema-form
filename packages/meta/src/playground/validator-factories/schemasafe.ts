import {
  validator as safeValidator,
  type Schema as SafeSchema,
} from "@exodus/schemasafe";
import { ROOT_SCHEMA_PREFIX } from "@sjsf/form/core";
import {
  DEFAULT_VALIDATOR_OPTIONS as DEFAULT_SCHEMASAFE_OPTIONS,
  createFormValidator,
} from "@sjsf/schemasafe-validator";

import type { CreatableValidator } from "../validator-factory.ts";

export const draft07: CreatableValidator = (options) =>
  createFormValidator(options);

export const draft2020: CreatableValidator = (options) =>
  createFormValidator({
    ...options,
    factory: (schema, rootSchema) =>
      safeValidator(schema as SafeSchema, {
        ...DEFAULT_SCHEMASAFE_OPTIONS,
        $schemaDefault: "https://json-schema.org/draft/2020-12/schema",
        schemas: {
          [ROOT_SCHEMA_PREFIX]: rootSchema as SafeSchema,
        },
      }),
  });
