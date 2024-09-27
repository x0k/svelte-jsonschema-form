import type {
  HTMLInputAttributes,
  HTMLSelectAttributes,
  HTMLTextareaAttributes,
} from "svelte/elements";

import type { Nullable } from "@/lib/types";

import type { FormContext } from "../context";
import type { InputAttributes } from "../ui-schema";
import type { RequiredAttributes } from "../widgets";

interface ReadonlyAndDisabled {
  readonly: boolean;
  disabled: boolean;
}

function readonlyAndDisabled<T extends Partial<Nullable<ReadonlyAndDisabled>>>(
  ctx: FormContext<unknown>,
  obj: T
) {
  obj.readonly ||= ctx.readonly;
  obj.disabled ||= ctx.disabled;
  return obj as T & ReadonlyAndDisabled;
}

export function inputAttributes(attributes: InputAttributes | undefined) {
  return attributes as HTMLInputAttributes | undefined;
}

export function textareaAttributes(attributes: InputAttributes | undefined) {
  return attributes as HTMLTextareaAttributes | undefined;
}

export function selectAttributes(attributes: InputAttributes | undefined) {
  return attributes as HTMLSelectAttributes | undefined;
}

export function makeAttributes<
  Base extends Omit<RequiredAttributes, keyof ReadonlyAndDisabled>,
  A extends Partial<Nullable<ReadonlyAndDisabled>>
>(ctx: FormContext<unknown>, base: Base, attributes: A | undefined) {
  return readonlyAndDisabled(ctx, Object.assign(base, attributes));
}
