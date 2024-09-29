import type { HTMLButtonAttributes } from "svelte/elements";
import type { FormContext } from "../context";
import type { InputAttributes } from "../ui-schema";

export function isDisabledOrReadonly(
  ctx: FormContext<unknown>,
  attributes:
    | InputAttributes
    | (HTMLButtonAttributes & { readonly?: boolean })
    | undefined
) {
  return (
    attributes?.disabled || attributes?.readonly || ctx.disabled || ctx.readonly
  );
}
