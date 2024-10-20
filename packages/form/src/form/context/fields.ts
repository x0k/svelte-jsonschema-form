import type { Config } from '../config.js';
import { createMessage } from '../error-message.svelte';
import type { FieldType, Field } from '../fields/model.js';

import type { FormContext } from './context.js';

function getFieldInternal<T extends FieldType>(
  ctx: FormContext,
  type: T,
  config: Config
): Field<T> | undefined {
  const field = config.uiSchema["ui:field"];
  switch (typeof field) {
    case "undefined":
      return ctx.fields(type, config);
    case "string":
      return ctx.fields(field as T, config);
    default:
      return field as Field<T>;
  }
}

export function getField<T extends FieldType>(
  ctx: FormContext,
  type: T,
  config: Config
): Field<T> {
  return (
    getFieldInternal(ctx, type, config) ??
    createMessage(`Field "${config.uiSchema["ui:field"] ?? type}" not found`) as Field<T>
  );
}
