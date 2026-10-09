import {
  registerSchema,
  restoreValidator,
  unregisterSchema,
  validate,
  type SchemaObject,
  type Validator,
} from "@hyperjump/json-schema/draft-07";
import { type Schema } from "@sjsf/form";
import { fromValidators } from "@sjsf/form/validators/precompile";
import { createFormValidatorFactory as hyperjumpFactory } from "@sjsf/hyperjump-validator/precompile";

import { DRAFT_07 } from "../validator-factory.ts";
import type { CompileValidator } from "../validator-factory.ts";

export const createIdFactory = () => {
  let id = 0;
  return () => `https://example.com/v${id++}`;
};

export const draft07: CompileValidator = async (schemas: Schema[]) => {
  for (const schema of schemas) {
    registerSchema({
      ...DRAFT_07,
      ...schema,
    } as SchemaObject);
  }
  try {
    const validators: Record<string, Validator> = {};
    for (const schema of schemas) {
      const validator = await validate(schema.$id!);
      validators[schema.$id!] = restoreValidator(validator.serialize());
    }
    return hyperjumpFactory({
      validatorRetriever: fromValidators(validators),
    });
  } finally {
    for (const s of schemas) {
      unregisterSchema(s.$id!);
    }
  }
};
