import {
  Validator as CfValidator,
  type Schema as CfSchema,
} from "@cfworker/json-schema";
import { createFormValidator } from "@sjsf/cfworker-validator";

import type { CreatableValidator } from "../validator-factory.ts";

export const draft07: CreatableValidator = (options) =>
  createFormValidator(options as Parameters<typeof createFormValidator>[0]);

export const draft2020: CreatableValidator = (options) =>
  createFormValidator({
    ...options,
    factory: (schema) => new CfValidator(schema as CfSchema, "2020-12", false),
  } as Parameters<typeof createFormValidator>[0]);
