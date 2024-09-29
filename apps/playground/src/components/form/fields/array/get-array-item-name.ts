import type { ArrayContext } from "./context";

export function getArrayItemName(ctx: ArrayContext, index: number) {
  return `${ctx.config.name}-${index}`;
}
