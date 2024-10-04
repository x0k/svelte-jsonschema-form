import type { ArrayContext } from "./context";

export function getArrayItemName(ctx: ArrayContext, index: number) {
  return `${ctx.config.name}__${index}`;
}

function titleWithIndex(title: string, index: number) {
  return `${title}-${index + 1}`;
}

export function getNormalArrayItemTitle(
  { config: { uiOptions, schema, title } }: ArrayContext,
  index: number
) {
  return titleWithIndex(uiOptions?.title ?? schema.title ?? title, index);
}

export function getFixedArrayItemTitle(
  {
    config: {
      uiSchema: { items: uiItems },
      schema: { items },
      title,
    },
  }: ArrayContext,
  index: number
) {
  if (Array.isArray(uiItems)) {
    const title = uiItems[index]?.["ui:options"]?.title;
    if (title) {
      return title;
    }
    uiItems = undefined;
  }
  if (Array.isArray(items)) {
    const item = items[index];
    if (typeof item === "object" && item.title) {
      return item.title;
    }
    items = undefined;
  }
  return titleWithIndex(
    uiItems?.["ui:options"]?.title ||
      (typeof items === "object" && items?.title) ||
      title,
    index
  );
}
