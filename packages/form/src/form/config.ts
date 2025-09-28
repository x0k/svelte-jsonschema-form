import type { Path, Schema } from "@/core/index.js";

import type { Id } from "./id.js";
import type { UiSchema } from "./ui-schema.js";

export interface Config {
  id: Id;
  path: Path;
  title: string;
  schema: Schema;
  uiSchema: UiSchema;
  required: boolean;
}
