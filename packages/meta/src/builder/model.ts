import type { Generated } from "../types.ts";
import {
  validators,
  isPrecompiledOnlyValidator,
  isInternalValidator,
  validatorTitle,
  isSchemaValidator,
} from "../validators.ts";

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
