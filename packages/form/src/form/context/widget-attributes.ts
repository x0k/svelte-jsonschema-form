import type {
  HTMLInputAttributes,
  HTMLSelectAttributes,
  HTMLTextareaAttributes,
} from "svelte/elements";

import type { Nullable } from "@/lib/types.js";
import type { Validator } from "@/core/index.js";

import type { Config } from "../config.js";
import { createPseudoId } from '../id.js';

import type { FormInternalContext } from "./context.js";

interface Disabled {
  disabled: boolean;
}

interface Handlers {
  onblur?: () => void;
  oninput?: () => void;
  onchange?: () => void;
}

export function isDisabled<V extends Validator>(
  ctx: FormInternalContext<V>,
  attributes?: Partial<Nullable<Disabled>>
) {
  return attributes?.disabled || ctx.disabled;
}

/**
 * NOTE: this function mutates `obj` parameter!
 */
export function defineDisabled<
  T extends Partial<Nullable<Disabled>>,
  V extends Validator,
>(ctx: FormInternalContext<V>, obj: T) {
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

export function inputAttributes<
  T extends Pick<
    HTMLInputAttributes,
    | "id"
    | "name"
    | "required"
    | "minlength"
    | "maxlength"
    | "pattern"
    | "min"
    | "max"
    | "step"
    | "list"
    | "readonly"
    | "oninput"
    | "onchange"
    | "onblur"
    | "disabled"
    | "type"
  >,
  V extends Validator,
>(
  ctx: FormInternalContext<V>,
  { id, required, schema }: Config,
  handlers: Handlers,
  attributes: T | undefined
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
        ? createPseudoId(id, "examples", ctx)
        : undefined,
      readonly: schema.readOnly,
      oninput: handlers.oninput,
      onchange: handlers.onchange,
      onblur: handlers.onblur,
    },
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

export function textareaAttributes<
  T extends Pick<
    HTMLTextareaAttributes,
    | "id"
    | "name"
    | "required"
    | "minlength"
    | "maxlength"
    | "readonly"
    | "oninput"
    | "onchange"
    | "onblur"
    | "disabled"
  >,
  V extends Validator,
>(
  ctx: FormInternalContext<V>,
  { id, required, schema }: Config,
  handlers: Handlers,
  attributes: T | undefined
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
      },
      attributes
    )
  );
}

export function selectAttributes<
  T extends Pick<
    HTMLSelectAttributes,
    "id" | "name" | "required" | "oninput" | "onchange" | "onblur" | "disabled"
  >,
  V extends Validator,
>(
  ctx: FormInternalContext<V>,
  { id, required }: Config,
  handlers: Handlers,
  attributes: T | undefined
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
      },
      attributes
    )
  );
}
