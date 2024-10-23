import type {
  HTMLButtonAttributes,
  HTMLInputAttributes,
  HTMLSelectAttributes,
  HTMLTextareaAttributes,
} from "svelte/elements";

import type { Nullable } from "@/lib/types.js";
import type { Schema } from '@/core/index.js';

import type { Config } from "../config.js";
import { computeId } from "../id-schema.js";

import type { FormContext } from './context.js';
import type { InputAttributes } from '../ui-schema.js';

interface Disabled {
  disabled: boolean;
}

interface Handlers {
  onblur?: (e: Event) => void;
  oninput?: (e: Event) => void;
  onchange?: (e: Event) => void;
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

function isReadonly(
  schema: Schema
) {
  return schema.readOnly || schema.const !== undefined;
}

export function inputAttributes(
  ctx: FormContext,
  { idSchema, required, schema, uiOptions }: Config,
  handlers: Handlers
) {
  const type = inputType(schema.format);
  return explicitDisabled(
    ctx,
    Object.assign(
      {
        id: idSchema.$id,
        name: idSchema.$id,
        required,
        minlength: schema.minLength,
        maxlength: schema.maxLength,
        pattern: schema.pattern,
        min: schema.minimum,
        max: schema.maximum,
        step:
          schema.multipleOf ?? (schema.type === "number" ? "any" : undefined),
        list: Array.isArray(schema.examples)
          ? computeId(idSchema, "examples")
          : undefined,
        readonly: isReadonly(schema),
        oninput: handlers.oninput,
        onchange: handlers.onchange,
        onblur: handlers.onblur,
      } satisfies HTMLInputAttributes,
      type && { type },
      uiOptions?.input as HTMLInputAttributes | undefined
    )
  );
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
        readonly: isReadonly(schema),
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
