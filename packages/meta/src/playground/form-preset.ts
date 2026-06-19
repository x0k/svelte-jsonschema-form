import type { CatalogMeta } from "../catalog.ts";
import type { FormState, NormalizedFormState } from "./form-state.ts";
import { normalizeJsonValue, normalizeValidator } from "./model.ts";

type RequiredFormPresetProperties = "schema" | "uiSchema" | "initialValue";

type Preset<T extends Record<string, any>> = Pick<
  T,
  RequiredFormPresetProperties
> &
  Partial<Omit<T, RequiredFormPresetProperties>>;

export type FormPreset = Preset<FormState>;

export type NormalizedFormPreset = Preset<NormalizedFormState>;

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

export function definePreset(
  preset: FormPreset | NormalizedFormPreset
): NormalizedFormPreset {
  return {
    ...preset,
    validator: preset.validator && normalizeValidator(preset.validator),
    schema: normalizeJsonValue(preset.schema),
    uiSchema: normalizeJsonValue(preset.uiSchema),
    initialValue: normalizeJsonValue(preset.initialValue),
  };
}

export function formPresetCategories(): Iterable<FormPresetCategory> {
  return ORDERED_CATEGORIES;
}
