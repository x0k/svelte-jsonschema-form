import type {
  HTMLInputAttributes,
  HTMLSelectAttributes,
  HTMLTextareaAttributes,
} from "svelte/elements";

import type { Nullable } from "@/lib/types.js";
import type { Validator } from "@/core/index.js";

import type { Config } from "../config.js";
import type { UiOptions } from "../ui-schema.js";
import { createPseudoId } from "../id.js";

import {
  retrieveUiProps,
  type FormInternalContext,
  type ObjectUiOptions,
} from "./context.js";

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
  V extends Validator,
  T extends Partial<Nullable<Disabled>>
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

export function inputAttributes(handlers: Handlers) {
  return <V extends Validator>(
    ctx: FormInternalContext<V>,
    { id, required, schema }: Config
  ) => {
    const data = {
      id,
      name: id,
      type: inputType(schema.format),
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
    } satisfies HTMLInputAttributes;
    if (data.type === undefined) {
      delete data.type;
    }
    return data;
  };
}

export function textareaAttributes(handlers: Handlers) {
  return <V extends Validator>(
    _: FormInternalContext<V>,
    { id, required, schema }: Config
  ) =>
    ({
      id,
      name: id,
      required,
      minlength: schema.minLength,
      maxlength: schema.maxLength,
      readonly: schema.readOnly,
      oninput: handlers.oninput,
      onchange: handlers.onchange,
      onblur: handlers.onblur,
    } satisfies HTMLTextareaAttributes);
}

export function selectAttributes(handlers: Handlers) {
  return <V extends Validator>(
    _: FormInternalContext<V>,
    { id, required }: Config
  ) =>
    ({
      id,
      name: id,
      required,
      oninput: handlers.oninput,
      onchange: handlers.onchange,
      onblur: handlers.onblur,
    } satisfies HTMLSelectAttributes);
}

export function retrieveInputAttributes<
  V extends Validator,
  O extends keyof ObjectUiOptions
>(
  ctx: FormInternalContext<V>,
  config: Config,
  option: O,
  attributes: (
    ctx: FormInternalContext<V>,
    config: Config
  ) => Exclude<UiOptions[O], undefined>
) {
  return defineDisabled(
    ctx,
    retrieveUiProps(ctx, config, option, attributes(ctx, config))
  );
}
