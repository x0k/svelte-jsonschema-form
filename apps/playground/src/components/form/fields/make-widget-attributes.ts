import type {
  HTMLInputAttributes,
  HTMLSelectAttributes,
  HTMLTextareaAttributes,
} from "svelte/elements";

import type { Nullable } from "@/lib/types";
import { noop } from "@/lib/function";
import { type Config, computeId } from "@/core";

import type { FormContext } from "../context";

interface Disabled {
  disabled: boolean;
}

interface ReadonlyAndDisabled extends Disabled {
  readonly: boolean;
}

interface Handlers {
  onfocus?: (e: Event) => void;
  onblur?: (e: Event) => void;
  onclick?: (e: Event) => void;
}

function readonlyAndDisabled<T extends Partial<Nullable<ReadonlyAndDisabled>>>(
  ctx: FormContext,
  obj: T
) {
  obj.readonly ||= ctx.readonly;
  obj.disabled ||= ctx.disabled;
  return obj as T & ReadonlyAndDisabled;
}

function inputType(format: string | undefined) {
  switch (format) {
    case "date-time":
      return "datetime-local";
    case "uri":
      return "url";
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
  { onblur = noop, onfocus = noop }: Handlers = {}
) {
  const type = inputType(schema.format);
  return readonlyAndDisabled(
    ctx,
    Object.assign(
      {
        id: idSchema.$id,
        name: idSchema.$id,
        required,
        onfocus,
        onblur,
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
      } satisfies HTMLInputAttributes,
      type && { type },
      uiOptions?.input as HTMLInputAttributes | undefined
    )
  );
}

export function textareaAttributes(
  ctx: FormContext,
  { idSchema, required, schema, uiOptions }: Config,
  { onblur = noop, onfocus = noop }: Handlers = {}
) {
  return readonlyAndDisabled(
    ctx,
    Object.assign(
      {
        id: idSchema.$id,
        name: idSchema.$id,
        required,
        minlength: schema.minLength,
        maxlength: schema.maxLength,
        onfocus,
        onblur,
      } satisfies HTMLTextareaAttributes,
      uiOptions?.input as HTMLTextareaAttributes | undefined
    )
  );
}

export function selectAttributes(
  ctx: FormContext,
  { idSchema, required, uiOptions }: Config,
  { onblur = noop, onfocus = noop }: Handlers = {}
) {
  return readonlyAndDisabled(
    ctx,
    Object.assign(
      {
        id: idSchema.$id,
        name: idSchema.$id,
        required,
        onfocus,
        onblur,
      } satisfies HTMLSelectAttributes,
      uiOptions?.input as HTMLSelectAttributes | undefined
    )
  );
}
