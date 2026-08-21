import {
  validator as safeValidator,
  type Schema as SafeSchema,
} from "@exodus/schemasafe";
import {
  DEFAULT_VALIDATOR_OPTIONS as DEFAULT_SCHEMASAFE_OPTIONS,
  createFormValidator,
  getRootSchemaId,
} from "@sjsf/schemasafe-validator";

import type { CreatableValidator } from "../validator-factory.ts";

export const draft07: CreatableValidator = (options) =>
  createFormValidator(options);

export const draft2020: CreatableValidator = ({ schema, ...rest }) => {
  const rootSchemaId = getRootSchemaId(schema);
  return createFormValidator({
    ...rest,
    schema,
    factory: (subSchema) =>
      safeValidator(subSchema as SafeSchema, {
        ...DEFAULT_SCHEMASAFE_OPTIONS,
        $schemaDefault: "https://json-schema.org/draft/2020-12/schema",
        schemas: {
          [rootSchemaId]: schema as SafeSchema,
        },
      }),
  });
};
