import type { Schema } from "./schema";
import type { UiSchema } from "./ui-schema";

export interface TranslationOptions {
  schema: Schema;
  uiSchema: UiSchema;
}

export type Label = "submit"

export type Translator = (label: Label, options: TranslationOptions) => string;
