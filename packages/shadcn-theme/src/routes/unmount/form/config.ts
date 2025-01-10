import type { Schema } from "@sjsf/form/core";

import type { IdSchema } from "./id-schema.js";
import type { UiOptions, UiSchema } from "./ui-schema.js";

export interface Config<V = unknown> {
  name: string;
  title: string;
  schema: Schema;
  uiSchema: UiSchema;
  idSchema: IdSchema<V>;
  uiOptions: UiOptions | undefined;
  required: boolean;
}
