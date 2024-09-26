import type { SchemaArrayValue } from "../../schema";

import type { ArrayContext } from "./context";

export function getArrayItemName(ctx: ArrayContext, index: number) {
  return `${ctx.name}-${index}`;
}

export function makeHandler(
  ctx: ArrayContext,
  fn: (arr: SchemaArrayValue) => void
) {
  return (e: Event) => {
    e.preventDefault();
    const arr = ctx.value;
    if (!Array.isArray(arr)) {
      console.warn("Value is not an array");
      return;
    }
    fn(arr);
  };
}
