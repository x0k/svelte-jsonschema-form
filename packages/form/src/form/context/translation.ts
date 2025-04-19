import type { Validator } from "@/core/index.js";

import type { Label, Labels, Translator } from "../translation.js";

import type { FormInternalContext } from "./context.js";

export function translate<V extends Validator, L extends Label>(
  ctx: FormInternalContext<V>,
  label: L,
  params: Labels[L]
) {
  const translator: Translator<L> | undefined = ctx.translation(label, params);
  if (translator === undefined) {
    return `Label "${label}" is not translated`;
  }
  return typeof translator === "string" ? translator : translator(params);
}
