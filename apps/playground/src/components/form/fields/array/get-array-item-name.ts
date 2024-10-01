import type { ArrayContext } from "./context";

export function getArrayItemName(ctx: ArrayContext, index: number) {
  return `${ctx.config.name}-${index}`;
}

export function getArrayItemTitle(
  { config: { uiOptions, schema, title } }: ArrayContext,
  index: number
) {
  return `${uiOptions?.title ?? schema.title ?? title}-${index + 1}`;
}
