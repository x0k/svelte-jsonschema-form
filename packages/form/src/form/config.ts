import type { Path, Schema } from "@/core/index.js";

import type { Id } from "./id.js";
import type { UiOptions, UiSchema } from "./ui-schema.js";

export interface Config {
  id: Id;
  path: Path;
  name: string;
  title: string;
  schema: Schema;
  uiSchema: UiSchema;
  uiOptions: UiOptions | undefined;
  required: boolean;
}
