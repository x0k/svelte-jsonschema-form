import type { IsPlainObject } from "@/lib/types.js";
import type { Validator } from "@/core/index.js";

import type { Config } from "../config.js";
import {
  resolveUiRef,
  type UiSchema,
  type UiSchemaDefinition,
  resolveUiOption as resolveUiOptionInternal,
  type UiOptions,
} from "../ui-schema.js";

import type { FormInternalContext } from "./context.js";

export function retrieveUiSchema<V extends Validator>(
  ctx: FormInternalContext<V>,
  uiSchemaDef: UiSchemaDefinition | undefined
) {
  return resolveUiRef(ctx.uiSchemaRoot, uiSchemaDef) ?? {};
}

function resolveUiOption<V extends Validator, O extends keyof UiOptions>(
  ctx: FormInternalContext<V>,
  uiSchema: UiSchema,
  option: O
) {
  return resolveUiOptionInternal(
    ctx.uiSchemaRoot,
    ctx.uiOptionsRegistry,
    uiSchema,
    option
  );
}

export function uiTitleOption<V extends Validator>(
  ctx: FormInternalContext<V>,
  uiSchema: UiSchema
) {
  return resolveUiOption(ctx, uiSchema, "title");
}

export function retrieveUiOption<
  V extends Validator,
  O extends keyof UiOptions
>(ctx: FormInternalContext<V>, config: Config, option: O) {
  return (
    ctx.extraUiOptions?.(option, config) ??
    resolveUiOption(ctx, config.uiSchema, option)
  );
}

export type ObjectUiOptions = {
  [K in keyof UiOptions as IsPlainObject<
    Exclude<UiOptions[K], undefined>
  > extends true
    ? K
    : never]: UiOptions[K];
};

export function uiOptionProps<O extends keyof ObjectUiOptions>(option: O) {
  return <V extends Validator>(
    props: Exclude<UiOptions[O], undefined>,
    config: Config,
    ctx: FormInternalContext<V>
  ): Exclude<UiOptions[O], undefined> => {
    return Object.assign(
      props,
      resolveUiOption(ctx, config.uiSchema, option),
      ctx.extraUiOptions?.(option, config as never)
    );
  };
}

export function uiOptionNestedProps<
  O extends keyof ObjectUiOptions,
  R extends object
>(
  option: O,
  selector: (data: Exclude<UiOptions[O], undefined>) => R | undefined
) {
  return <V extends Validator>(
    props: R,
    config: Config,
    ctx: FormInternalContext<V>
  ): R => {
    const options = resolveUiOption(ctx, config.uiSchema, option);
    const extraOptions = ctx.extraUiOptions?.(option, config as never);
    return Object.assign(
      props,
      options && selector(options),
      extraOptions && selector(extraOptions)
    );
  };
}
