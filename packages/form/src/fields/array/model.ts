export type ItemTitle = (
  title: string,
  index: number,
  fixedItemsCount: number
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
