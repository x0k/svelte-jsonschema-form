import type { CatalogMeta } from "../catalog.ts";
import type { FormState } from "./form-state.ts";

type RequiredFormPresetProperties = "schema" | "uiSchema" | "initialValue";

export type FormPreset = Pick<FormState, RequiredFormPresetProperties> &
  Partial<Omit<FormState, RequiredFormPresetProperties>>;

// NOTE: Order is important
export enum FormPresetCategory {
  SchemaBasics = "Schema Basics",
  SchemaLogic = "Schema Logic",
  UiCustomization = "UI customization",
  Other = "Other",
}

const ORDERED_CATEGORIES = Object.values(FormPresetCategory);

export enum PresetTag {
  Array = "array",
  Composition = "composition",
  Conditional = "conditional",
  Layout = "layout",
  Null = "null",
  Object = "object",
  Reference = "reference",
  Validation = "validation",
  Widget = "widget",
}

export type PresetMeta = CatalogMeta<FormPresetCategory, PresetTag>;

export function defineMetadata(meta: PresetMeta): PresetMeta {
  return meta;
}

export function definePreset(preset: FormPreset): FormPreset {
  return preset;
}

export function formPresetCategories(): Iterable<FormPresetCategory> {
  return ORDERED_CATEGORIES;
}
