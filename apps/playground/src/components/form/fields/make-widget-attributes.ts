import type {
  HTMLInputAttributes,
  HTMLSelectAttributes,
  HTMLTextareaAttributes,
} from "svelte/elements";

import type { Nullable } from "@/lib/types";
import { noop } from "@/lib/function";

import type { FormContext } from "../context";
import type { InputAttributes } from "../ui-schema";
import type { RequiredAttributes } from "../widgets";
import type { Config } from "../config";

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
  A extends Partial<Nullable<ReadonlyAndDisabled>>
>(
  ctx: FormContext<unknown>,
  config: Config,
  attributes: (attributes: InputAttributes | undefined) => A | undefined,
  {
    onfocus = noop,
    onblur = noop,
  }: {
    onfocus?: () => void;
    onblur?: () => void;
  } = {}
) {
  return readonlyAndDisabled(
    ctx,
    Object.assign(
      {
        id: config.idSchema.$id,
        name: config.idSchema.$id,
        required: config.required,
        onfocus,
        onblur,
      } satisfies Omit<RequiredAttributes, keyof ReadonlyAndDisabled>,
      attributes(config.uiOptions?.input)
    )
  );
}
