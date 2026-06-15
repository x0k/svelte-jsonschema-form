export interface CatalogMeta<TCategory extends string, TTag extends string> {
  category: TCategory;
  title: string;
  description: string;
  tags: TTag[];
}

export interface CatalogEntry<TMeta, TItem> {
  meta: TMeta;
  path: string;
  load: () => Promise<TItem>;
}

export function filterByTags<T>(
  items: readonly T[],
  selectedTags: ReadonlySet<string>,
  getTags: (item: T) => readonly string[]
): T[] {
  if (selectedTags.size === 0) return [...items];
  const selected = [...selectedTags];
  return items.filter((item) => {
    const tags = getTags(item);
    return selected.every((st) => tags.includes(st));
  });
}
