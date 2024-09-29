import type { IdSchema } from "./id-schema";
import type { Schema, SchemaValue } from "./schema";
import type { UiOptions, UiSchema } from "./ui-schema";
import Message from "./error-message.svelte";

export const createMessage =
  (message: string): typeof Message =>
  (internal) =>
    Message(internal, { message });

export interface Config<V = unknown> {
  name: string;
  schema: Schema;
  uiSchema: UiSchema;
  idSchema: IdSchema<V>;
  uiOptions: UiOptions | undefined;
  required: boolean;
}
