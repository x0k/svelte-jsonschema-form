import type { Schema } from "@/core/index.js";

import type { FieldPath } from "./id.js";
import type { UiSchema } from "./ui-schema.js";

export interface Config {
  path: FieldPath;
  title: string;
  schema: Schema;
  uiSchema: UiSchema;
  required: boolean;
}
