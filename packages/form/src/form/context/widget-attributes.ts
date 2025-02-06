import type {
  HTMLButtonAttributes,
  HTMLInputAttributes,
  HTMLSelectAttributes,
  HTMLTextareaAttributes,
} from "svelte/elements";

import type { Nullable } from "@/lib/types.js";

import type { Config } from "../config.js";
import type { InputAttributes } from "../ui-schema.js";
import type { Handlers } from "../widgets.js";

import type { FormContext } from "./context.js";
import { makePseudoId } from "./id-schema.js";

interface Disabled {
  disabled: boolean;
}

function explicitDisabled<T extends Partial<Nullable<Disabled>>>(
  ctx: FormContext,
  obj: T
) {
  obj.disabled ||= ctx.disabled;
  return obj as T & Disabled;
}

function inputType(format: string | undefined) {
  switch (format) {
    case "date-time":
      return "datetime-local";
    case "uri":
      return "url";
    case "color":
    case "date":
    case "time":
    case "email":
      return format;
    default:
      return undefined;
  }
}

export function inputAttributes(
  ctx: FormContext,
  { idSchema, required, schema, uiOptions }: Config,
  handlers: Handlers
) {
  const data = Object.assign(
    {
      id: idSchema.$id,
      name: idSchema.$id,
      required,
      minlength: schema.minLength,
      maxlength: schema.maxLength,
      pattern: schema.pattern,
      min: schema.minimum,
      max: schema.maximum,
      step: schema.multipleOf ?? (schema.type === "number" ? "any" : undefined),
      list: Array.isArray(schema.examples)
        ? makePseudoId(ctx, idSchema.$id, "examples")
        : undefined,
      readonly: schema.readOnly,
      oninput: handlers.oninput,
      onchange: handlers.onchange,
      onblur: handlers.onblur,
    } satisfies HTMLInputAttributes,
    uiOptions?.input as HTMLInputAttributes | undefined
  );
  if (data.type === undefined) {
    const type = inputType(schema.format);
    if (type !== undefined) {
      data.type = type;
    }
  }
  return explicitDisabled(ctx, data);
}

export function textareaAttributes(
  ctx: FormContext,
  { idSchema, required, schema, uiOptions }: Config,
  handlers: Handlers
) {
  return explicitDisabled(
    ctx,
    Object.assign(
      {
        id: idSchema.$id,
        name: idSchema.$id,
        required,
        minlength: schema.minLength,
        maxlength: schema.maxLength,
        readonly: schema.readOnly,
        oninput: handlers.oninput,
        onchange: handlers.onchange,
        onblur: handlers.onblur,
      } satisfies HTMLTextareaAttributes,
      uiOptions?.input as HTMLTextareaAttributes | undefined
    )
  );
}

export function selectAttributes(
  ctx: FormContext,
  { idSchema, required, uiOptions }: Config,
  handlers: Handlers
) {
  return explicitDisabled(
    ctx,
    Object.assign(
      {
        id: idSchema.$id,
        name: idSchema.$id,
        required,
        oninput: handlers.oninput,
        onchange: handlers.onchange,
        onblur: handlers.onblur,
      } satisfies HTMLSelectAttributes,
      uiOptions?.input as HTMLSelectAttributes | undefined
    )
  );
}

export function isDisabled(
  ctx: FormContext,
  attributes: InputAttributes | HTMLButtonAttributes | undefined
) {
  return attributes?.disabled || ctx.disabled;
}
