import type {
  HTMLInputAttributes,
  HTMLSelectAttributes,
  HTMLTextareaAttributes,
} from "svelte/elements";

import type { Nullable } from "@/lib/types.js";

import type { Config } from "../config.js";

import type { FormContext } from "./context.js";
import { createPseudoId } from "./id.js";

interface Disabled {
  disabled: boolean;
}

interface Handlers {
  onblur?: (e: Event) => void;
  oninput?: (e: Event) => void;
  onchange?: (e: Event) => void;
}

export function isDisabled<E>(
  ctx: FormContext<E>,
  attributes?: Partial<Nullable<Disabled>>
) {
  return attributes?.disabled || ctx.disabled;
}

/**
 * NOTE: this function mutates `obj` parameter!
 */
export function defineDisabled<T extends Partial<Nullable<Disabled>>, E>(
  ctx: FormContext<E>,
  obj: T
) {
  obj.disabled ||= ctx.disabled;
  return obj as T & Disabled;
}

export function inputType(format: string | undefined) {
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

export function inputAttributes<E>(
  ctx: FormContext<E>,
  { id, required, schema }: Config,
  handlers: Handlers,
  attributes: HTMLInputAttributes | undefined
) {
  const data = Object.assign(
    {
      id,
      name: id,
      required,
      minlength: schema.minLength,
      maxlength: schema.maxLength,
      pattern: schema.pattern,
      min: schema.minimum,
      max: schema.maximum,
      step: schema.multipleOf ?? (schema.type === "number" ? "any" : undefined),
      list: Array.isArray(schema.examples)
        ? createPseudoId(ctx, id, "examples")
        : undefined,
      readonly: schema.readOnly,
      oninput: handlers.oninput,
      onchange: handlers.onchange,
      onblur: handlers.onblur,
    } satisfies HTMLInputAttributes,
    attributes
  );
  if (data.type === undefined) {
    const type = inputType(schema.format);
    if (type !== undefined) {
      data.type = type;
    }
  }
  return defineDisabled(ctx, data);
}

export function textareaAttributes<E>(
  ctx: FormContext<E>,
  { id, required, schema }: Config,
  handlers: Handlers,
  attributes: HTMLTextareaAttributes | undefined
) {
  return defineDisabled(
    ctx,
    Object.assign(
      {
        id,
        name: id,
        required,
        minlength: schema.minLength,
        maxlength: schema.maxLength,
        readonly: schema.readOnly,
        oninput: handlers.oninput,
        onchange: handlers.onchange,
        onblur: handlers.onblur,
      } satisfies HTMLTextareaAttributes,
      attributes
    )
  );
}

export function selectAttributes<E>(
  ctx: FormContext<E>,
  { id, required }: Config,
  handlers: Handlers,
  attributes: HTMLSelectAttributes | undefined
) {
  return defineDisabled(
    ctx,
    Object.assign(
      {
        id,
        name: id,
        required,
        oninput: handlers.oninput,
        onchange: handlers.onchange,
        onblur: handlers.onblur,
      } satisfies HTMLSelectAttributes,
      attributes
    )
  );
}
