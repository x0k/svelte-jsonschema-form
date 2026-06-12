import { docsSchema } from "@astrojs/starlight/schema";
import { defineCollection, type CollectionEntry } from "astro:content";
import { z } from "astro/zod";
import { changelogsLoader } from "./loaders/changelogs";
import { isValidPackageCodeName } from "./shared";

export const baseSchema = z.object({
  type: z.literal("base").optional().default("base"),
});

export const packageSchema = baseSchema.extend({
  type: z.literal("package"),
  packageCodeName: z.string().refine((name) => isValidPackageCodeName(name), {
    message: `Invalid package code name`,
  }),
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
    loader: changelogsLoader(),
    schema: docsSchema({ extend: docsCollectionSchema }),
  }),
};
