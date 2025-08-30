import type { SchemaValue } from '@/core/schema.js';

export type ItemTitle = (
  title: string,
  index: number,
  fixedItemsCount: number,
  // TODO: Make required in v3
  itemValue?: SchemaValue | undefined
) => string;

export function titleWithIndex(
  title: string,
  index: number,
  fixedItemsCount: number
) {
  return index >= fixedItemsCount
    ? `${title}-${index - fixedItemsCount + 1}`
    : title;
}
