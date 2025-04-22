import {
  retrieveUiSchema,
  type Config,
  type FormInternalContext,
  type Validator,
} from "@/form/index.js";

export function getArrayItemName(config: Config, index: number) {
  return `${config.name}__${index}`;
}

function titleWithIndex(title: string, index: number) {
  return `${title}-${index + 1}`;
}

export function getNormalArrayItemTitle(
  { uiOptions, schema, title }: Config,
  index: number
) {
  return titleWithIndex(uiOptions?.title ?? schema.title ?? title, index);
}

export function getFixedArrayItemTitle<V extends Validator>(
  ctx: FormInternalContext<V>,
  { uiSchema: { items: uiItems }, schema: { items }, title }: Config,
  index: number
) {
  if (Array.isArray(uiItems)) {
    const title = retrieveUiSchema(ctx, uiItems[index])["ui:options"]?.title;
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
    retrieveUiSchema(ctx, uiItems)["ui:options"]?.title ||
      (typeof items === "object" && items?.title) ||
      title,
    index
  );
}
