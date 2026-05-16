import type { FormState } from "./form-state.ts";

type RequiredFormPresetProperties = "schema" | "uiSchema" | "initialValue";

export type FormPreset = Pick<FormState, RequiredFormPresetProperties> &
  Partial<Omit<FormState, RequiredFormPresetProperties>>;

const FORM_PRESET_CATEGORIES = [
  "Schema Basics",
  "Schema Logic",
  "UI customization",
  "Other",
] as const;

export type FormPresetCategory = (typeof FORM_PRESET_CATEGORIES)[number];

export function formPresetCategories(): Iterable<FormPresetCategory> {
  return FORM_PRESET_CATEGORIES;
}

const PRESET_CATEGORIES = import.meta.glob("./form-presets/*.js", {
  import: "category",
  eager: true,
});
const PRESET_LOADERS = import.meta.glob("./form-presets/*.js", {
  import: "default",
  eager: false,
});
function presetName(path: string) {
  return path.slice(15, path.length - 3);
}
const SORTED_PRESETS = Object.keys(PRESET_LOADERS)
  .map((path) => ({
    category: PRESET_CATEGORIES[path]! as FormPresetCategory,
    path,
    name: presetName(path),
    load: PRESET_LOADERS[path]! as () => Promise<FormPreset>,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));
export const GROUPED_FORM_PRESETS = Object.groupBy(
  SORTED_PRESETS,
  (s) => s.category,
);
