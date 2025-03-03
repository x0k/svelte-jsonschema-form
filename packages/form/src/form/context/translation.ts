import type { Label, Labels } from "../translation.js";
import type { FormValidator } from "../validator.js";

import type { FormContext } from "./context.js";

export function translate<VE, V extends FormValidator<VE>, L extends Label>(
  ctx: FormContext<VE, V>,
  label: L,
  params: Labels[L]
) {
  const translator = ctx.translation(label, params);
  if (translator === undefined) {
    return `Label "${label}" is not translated`;
  }
  return typeof translator === "string" ? translator : translator(params);
}
