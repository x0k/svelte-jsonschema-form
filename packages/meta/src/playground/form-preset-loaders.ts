import type { CatalogEntry } from "../catalog.ts";
import type { FormPreset, PresetMeta } from "./form-preset.ts";

const PRESET_METADATA = import.meta.glob("./form-presets/*.js", {
  import: "meta",
  eager: true,
});
const PRESET_LOADERS = import.meta.glob("./form-presets/*.js", {
  import: "default",
  eager: false,
});

export type PresetEntry = CatalogEntry<PresetMeta, FormPreset>;

export const SORTED_PRESETS: PresetEntry[] = Object.keys(PRESET_LOADERS)
  .map((path) => ({
    meta: PRESET_METADATA[path]! as PresetMeta,
    path,
    load: PRESET_LOADERS[path]! as () => Promise<FormPreset>,
  }))
  .sort((a, b) => a.meta.title.localeCompare(b.meta.title));

export const GROUPED_FORM_PRESETS = Object.groupBy(
  SORTED_PRESETS,
  (s) => s.meta.category,
);
