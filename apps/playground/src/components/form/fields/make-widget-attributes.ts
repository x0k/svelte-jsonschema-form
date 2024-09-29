import type {
  HTMLButtonAttributes,
  HTMLInputAttributes,
  HTMLSelectAttributes,
  HTMLTextareaAttributes,
} from "svelte/elements";

import type { Nullable } from "@/lib/types";
import { noop } from "@/lib/function";

import type { FormContext } from "../context";
import type { Config } from "../config";

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
  ctx: FormContext<unknown>,
  obj: T
) {
  obj.readonly ||= ctx.readonly;
  obj.disabled ||= ctx.disabled;
  return obj as T & ReadonlyAndDisabled;
}

export function inputAttributes(
  ctx: FormContext<unknown>,
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
        onfocus,
        onblur,
        minlength: schema.minLength,
        maxlength: schema.maxLength,
        pattern: schema.pattern,
        min: schema.minimum,
        max: schema.maximum,
        step: schema.multipleOf,
      } satisfies HTMLInputAttributes,
      uiOptions?.input as HTMLInputAttributes | undefined
    )
  );
}

export function textareaAttributes(
  ctx: FormContext<unknown>,
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
  ctx: FormContext<unknown>,
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

function readonlyOrDisabled<T extends Partial<Nullable<Disabled>>>(
  ctx: FormContext<unknown>,
  obj: T
) {
  obj.disabled ||= ctx.disabled || ctx.readonly;
  return obj as T & Disabled;
}
