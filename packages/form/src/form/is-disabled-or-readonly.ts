import type { HTMLButtonAttributes } from "svelte/elements";

import type { InputAttributes } from "@/core/ui-schema.js";

import type { FormContext } from "./context.js";

export function isDisabledOrReadonly(
  ctx: FormContext,
  attributes:
    | InputAttributes
    | (HTMLButtonAttributes & { readonly?: boolean })
    | undefined
) {
  return (
    attributes?.disabled || attributes?.readonly || ctx.disabled || ctx.readonly
  );
}
