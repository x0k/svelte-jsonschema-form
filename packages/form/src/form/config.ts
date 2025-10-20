import type { Schema } from "@/core/index.js";

import type { FieldPath } from "./id.js";
import type { UiSchema } from "./ui-schema.js";

export interface Config {
  readonly path: FieldPath;
  readonly title: string;
  readonly schema: Schema;
  readonly uiSchema: UiSchema;
  readonly required: boolean;
}
