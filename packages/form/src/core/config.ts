import type { IdSchema } from "./id-schema";
import type { Schema } from "./schema";
import type { UiOptions, UiSchema } from "./ui-schema";

export interface Config<V = unknown> {
  name: string;
  title: string;
  schema: Schema;
  uiSchema: UiSchema;
  idSchema: IdSchema<V>;
  uiOptions: UiOptions | undefined;
  required: boolean;
}
