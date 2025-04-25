import type { Config } from "@/form/index.js";

export function getArrayItemName(arrayConfig: Config, index: number) {
  return `${arrayConfig.name}__${index}`;
}

export function titleWithIndex(
  title: string,
  index: number,
  fixedItemsCount: number
) {
  return index >= fixedItemsCount
    ? `${title}-${index - fixedItemsCount + 1}`
    : title;
}
