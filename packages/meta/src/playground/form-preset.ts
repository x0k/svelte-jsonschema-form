import type { FormValue, Schema, UiSchemaRoot } from "@sjsf/form";

import type { CatalogMeta } from "../catalog.ts";
import type { FormState } from "./form-state.ts";
import type { SchemaType } from "./typed-schema.ts";

type RequiredFormPresetProperties = "schema" | "uiSchema" | "formData";

type Preset<T extends Record<string, any>> = Pick<
  T,
  RequiredFormPresetProperties
> &
  Partial<Omit<T, RequiredFormPresetProperties>>;

export type FormPreset = Preset<FormState>;

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

export type PresetMeta = CatalogMeta<FormPresetCategory, PresetTag> & {
  schema: SchemaType;
};

export function defineMetadata(meta: PresetMeta): PresetMeta {
  return meta;
}

export function definePreset(preset: FormPreset): FormPreset {
  return preset;
}

export function jsonSchema(schema: Schema): string {
  return JSON.stringify(schema, null, 2);
}

export function jsonUiSchema(uiSchema: UiSchemaRoot): string {
  return JSON.stringify(uiSchema, null, 2);
}

export function jsonValue(value: FormValue): string {
  return JSON.stringify(value, null, 2);
}

export function formPresetCategories(): Iterable<FormPresetCategory> {
  return ORDERED_CATEGORIES;
}
