import { iconSets } from "../icons.ts";
import type { Generated } from "../types.ts";
import {
  isPrecompiledOnlyValidator,
  isPrecompiledValidator,
  validators,
} from "../validators.ts";

export interface SelectOption {
  value: string;
  label?: string | undefined;
  hint?: string | undefined;
}

export const SVELTE_KIT_INTEGRATION_OPTIONS = [
  { value: "no", label: "No" },
  { value: "formActions", label: "Form Actions" },
  {
    value: "remoteFunctions",
    label: "Remote Functions",
    hint: "experimental",
  },
] as const satisfies SelectOption[];

export type SvelteKitIntegrationOption =
  (typeof SVELTE_KIT_INTEGRATION_OPTIONS)[number]["value"];

const PRECOMPILED_SUFFIX = `_precompiled`;

type WithPrecompiledSuffix<T extends string> =
  `${T}${typeof PRECOMPILED_SUFFIX}`;

export function isEndsWithPrecompiled(
  v: string,
): v is WithPrecompiledSuffix<string> {
  return v.endsWith(PRECOMPILED_SUFFIX);
}

export function withoutPrecompiledSuffix<V extends string>(
  v: V | WithPrecompiledSuffix<V>,
): V {
  return isEndsWithPrecompiled(v)
    ? (v.slice(0, -PRECOMPILED_SUFFIX.length) as V)
    : v;
}

export function* codegenValidators() {
  for (const v of validators()) {
    if (!isPrecompiledOnlyValidator(v)) {
      yield v;
    }
    if (isPrecompiledValidator(v)) {
      yield `${v}${PRECOMPILED_SUFFIX}` as const;
    }
  }
}

export type CodegenValidator = Generated<typeof codegenValidators>;

export function* codegenIconSets() {
  yield "none";
  yield* iconSets();
}

export type CodegenIconSet = Generated<typeof codegenIconSets>;
