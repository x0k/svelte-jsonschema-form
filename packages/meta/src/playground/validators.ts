import { ROOT_SCHEMA_PREFIX } from "@sjsf/form/core";
import type { FormValidator } from "@sjsf/form";
import {
  addFormComponents,
  createFormValidator as ajv8,
} from "@sjsf/ajv8-validator";
import { createFormValidator as cfworker } from "@sjsf/cfworker-validator";
import {
  DEFAULT_VALIDATOR_OPTIONS as DEFAULT_CFWORKER_OPTIONS,
  createFormValidator as schemasafe,
} from "@sjsf/schemasafe-validator";
import {
  createFormValidator as ata,
  DEFAULT_VALIDATOR_OPTIONS as DEFAULT_ATA_OPTIONS,
} from "@sjsf-lab/ata-validator";
import { Ajv2020 } from "ajv/dist/2020.js";
import _addFormats, { type FormatsPlugin } from "ajv-formats";
import {
  Validator as CfValidator,
  type Schema as CfSchema,
} from "@cfworker/json-schema";
import {
  validator as safeValidator,
  type Schema as SafeSchema,
} from "@exodus/schemasafe";
import { Validator as AtaValidator } from "ata-validator";

import type { Generated } from "../types.ts";
import {
  isJsonSchemaValidator,
  isPrecompiledOnlyValidator,
  validators,
} from "../validators.ts";

const addFormats = _addFormats as unknown as FormatsPlugin;

export function* playgroundValidators() {
  for (const v of validators()) {
    if (!isJsonSchemaValidator(v) || isPrecompiledOnlyValidator(v)) {
      continue;
    }
    yield v;
    yield `${v}_2020` as const;
  }
}

export type PlaygroundValidator = Generated<typeof playgroundValidators>;

export const PLAYGROUND_VALIDATORS = {
  ajv8: <T>(options: Parameters<typeof ajv8>[0]) =>
    ajv8<T>({
      ...options,
      ajvPlugins: (ajv) => addFormComponents(addFormats(ajv)),
    }),
  ajv8_2020: <T>(options: Parameters<typeof ajv8>[0]) =>
    ajv8<T>({
      ...options,
      Ajv: Ajv2020,
      ajvPlugins: (ajv) => addFormComponents(addFormats(ajv)),
    }),
  cfworker,
  cfworker_2020: <T>(options: Parameters<typeof cfworker>[0]) =>
    cfworker<T>({
      ...options,
      factory: (schema) =>
        new CfValidator(schema as CfSchema, "2020-12", false),
    }),
  schemasafe,
  schemasafe_2020: <T>(options: Parameters<typeof schemasafe>[0]) =>
    schemasafe<T>({
      ...options,
      factory: (schema, rootSchema) =>
        safeValidator(schema as SafeSchema, {
          ...DEFAULT_CFWORKER_OPTIONS,
          $schemaDefault: "https://json-schema.org/draft/2020-12/schema",
          schemas: {
            [ROOT_SCHEMA_PREFIX]: rootSchema as SafeSchema,
          },
        }),
    }),
  ata,
  ata_2020: <T>(options: Parameters<typeof ata>[0]) =>
    ata<T>({
      ...options,
      factory: (schema) => new AtaValidator(schema, DEFAULT_ATA_OPTIONS),
    }),
} satisfies Record<PlaygroundValidator, <T>(...args: any) => FormValidator<T>>;
