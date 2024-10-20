import type { HTMLButtonAttributes } from "svelte/elements";

import type { InputAttributes } from "./ui-schema.js";
import type { FormContext } from "./context/index.js";

export function isDisabled(
  ctx: FormContext,
  attributes: InputAttributes | HTMLButtonAttributes | undefined
) {
  return attributes?.disabled || ctx.disabled;
}
