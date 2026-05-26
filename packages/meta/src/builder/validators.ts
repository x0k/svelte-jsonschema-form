import type { FormValidator } from "@sjsf/form";
import {
  addFormComponents,
  createFormValidator as ajv8,
} from "@sjsf/ajv8-validator";
import { createFormValidator as cfworker } from "@sjsf/cfworker-validator";
import { createFormValidator as schemasafe } from "@sjsf/schemasafe-validator";
import { createFormValidator as ata } from "@sjsf-lab/ata-validator";
import _addFormats, { type FormatsPlugin } from "ajv-formats";

import type { Generated } from "../types.ts";
import {
  isInternalValidator,
  isPrecompiledOnlyValidator,
  isSchemaValidator,
  validators,
  validatorTitle,
} from "../validators.ts";

const addFormats = _addFormats as unknown as FormatsPlugin;

export function* builderValidators() {
  for (const v of validators()) {
    if (isPrecompiledOnlyValidator(v) || isInternalValidator(v)) {
      continue;
    }
    yield v;
  }
}

export type BuilderValidator = Generated<typeof builderValidators>;

export function builderValidatorTitle(v: BuilderValidator) {
  const title = validatorTitle(v);
  return isSchemaValidator(v) ? `${title} (output only)` : title;
}

const ajv8Factory = <T>(options: Parameters<typeof ajv8>[0]) =>
  ajv8<T>({
    ...options,
    ajvPlugins: (ajv) => addFormComponents(addFormats(ajv)),
  });

export const BUILDER_VALIDATORS = {
  ajv8: ajv8Factory,
  ata,
  cfworker,
  schemasafe,
  valibot: ajv8Factory,
  zod4: ajv8Factory,
} satisfies Record<BuilderValidator, <T>(...args: any) => FormValidator<T>>;
