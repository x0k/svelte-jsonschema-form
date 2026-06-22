import {
  codegenIsExternalValidator,
  codegenValidators,
  type Draft2020,
} from "../codegen/index.ts";
import { playgroundValidatorTitle } from "../playground/model.ts";
import type { Generated } from "../types.ts";

// TODO: Remove in v4
/** @deprecated */
export function* builderValidators() {
  for (const v of codegenValidators()) {
    if (!codegenIsExternalValidator(v) || v.draft2020 || v.precompiled) {
      continue;
    }
    yield v.name;
  }
}

// TODO: Remove in v4
/** @deprecated */
export type BuilderValidator1 = Generated<typeof builderValidators>;

export function* builderValidators2() {
  for (const v of codegenValidators()) {
    if (!codegenIsExternalValidator(v) || v.draft2020) {
      continue;
    }
    yield v;
  }
}

export type BuilderValidator2 = Generated<typeof builderValidators2>;

export type BuilderValidator = BuilderValidator1 | BuilderValidator2;

export function normalizeBuilderValidator(
  validator: BuilderValidator
): BuilderValidator2 {
  return typeof validator === "string"
    ? ({
        name: validator,
        draft2020: false,
        precompiled: false,
      } as BuilderValidator2)
    : ({ ...validator, draft2020: false } as BuilderValidator2);
}

export function builderValidatorTitle(v: BuilderValidator2) {
  return playgroundValidatorTitle(v);
}

export type BuilderValidatorName = BuilderValidator2["name"];

export type BuilderValidatorId =
  | BuilderValidatorName
  | `${BuilderValidatorName}:precompiled`;

export function builderValidatorId(v: BuilderValidator2): BuilderValidatorId {
  return v.precompiled ? `${v.name}:precompiled` : v.name;
}

export function builderValidatorFromId(
  id: BuilderValidatorId
): BuilderValidator2 {
  const [name, suffix] = id.split(":") as [BuilderValidatorName, string?];
  return {
    name,
    draft2020: false,
    precompiled: suffix === "precompiled",
  } as BuilderValidator2 & Draft2020<false>;
}
