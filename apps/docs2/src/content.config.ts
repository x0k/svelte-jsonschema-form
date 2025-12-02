import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";
import { defineCollection, z, type CollectionEntry } from "astro:content";
import { isValidPackageName } from "./shared";

export const baseSchema = z.object({
  type: z.literal("base").optional().default("base"),
});

export const packageSchema = baseSchema.extend({
  type: z.literal("package"),
  package: z.string().refine(
    (name) => isValidPackageName(name),
    (name) => ({ message: `Invalid package name: "${name}"` })
  ),
});

export const docsCollectionSchema = z.union([baseSchema, packageSchema]);

export type DocsEntryData = z.infer<typeof docsCollectionSchema>;

export type DocsEntryType = DocsEntryData["type"];

export type DocsEntry<T extends DocsEntryType> = CollectionEntry<"docs"> & {
  data: Extract<DocsEntryData, { type: T }>;
};

export function createIsDocsEntry<T extends DocsEntryType>(type: T) {
  return (entry: CollectionEntry<"docs">): entry is DocsEntry<T> =>
    entry.data.type === type;
}

export type PackageEntry = DocsEntry<"package">;

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({ extend: docsCollectionSchema }),
  }),
};
