import type { ObjectProperties } from "@/lib/types.js";
import { overrideByRecord } from "@/lib/resolver.js";
import type { Validator } from "@/core/index.js";

import type { Config } from "../config.js";
import {
  resolveUiRef,
  type UiSchema,
  type UiSchemaDefinition,
  resolveUiOption as resolveUiOptionInternal,
  type UiOptions,
} from "../ui-schema.js";
import { createTranslate } from "../translation.js";
import {
  FORM_EXTRA_UI_OPTIONS,
  FORM_TRANSLATION,
  FORM_UI_OPTIONS_REGISTRY,
  FORM_UI_SCHEMA_ROOT,
} from "../internals.js";
import type { FormState } from "./state.js";

export function retrieveUiSchema<T, V extends Validator>(
  ctx: FormState<T, V>,
  uiSchemaDef: UiSchemaDefinition | undefined
) {
  return resolveUiRef(ctx[FORM_UI_SCHEMA_ROOT], uiSchemaDef) ?? {};
}

function resolveUiOption<T, V extends Validator, O extends keyof UiOptions>(
  ctx: FormState<T, V>,
  uiSchema: UiSchema,
  option: O
) {
  return resolveUiOptionInternal(
    ctx[FORM_UI_SCHEMA_ROOT],
    ctx[FORM_UI_OPTIONS_REGISTRY],
    uiSchema,
    option
  );
}

export function uiTitleOption<T, V extends Validator>(
  ctx: FormState<T, V>,
  uiSchema: UiSchema
) {
  return resolveUiOption(ctx, uiSchema, "title");
}

export function retrieveUiOption<
  T,
  V extends Validator,
  O extends keyof UiOptions,
>(ctx: FormState<T, V>, config: Config, option: O) {
  return (
    ctx[FORM_EXTRA_UI_OPTIONS]?.(option, config) ??
    resolveUiOption(ctx, config.uiSchema, option)
  );
}

export type ObjectUiOptions = ObjectProperties<UiOptions>;

export function uiOptionProps<O extends keyof ObjectUiOptions>(option: O) {
  return <T, V extends Validator>(
    props: NonNullable<UiOptions[O]>,
    config: Config,
    ctx: FormState<T, V>
  ): NonNullable<UiOptions[O]> => {
    return Object.assign(
      props,
      resolveUiOption(ctx, config.uiSchema, option),
      ctx[FORM_EXTRA_UI_OPTIONS]?.(option, config as never)
    );
  };
}

export function uiOptionNestedProps<
  O extends keyof ObjectUiOptions,
  R extends object,
>(option: O, selector: (data: NonNullable<UiOptions[O]>) => R | undefined) {
  return <T, V extends Validator>(
    props: R,
    config: Config,
    ctx: FormState<T, V>
  ): R => {
    const options = resolveUiOption(ctx, config.uiSchema, option);
    const extraOptions = ctx[FORM_EXTRA_UI_OPTIONS]?.(option, config as never);
    return Object.assign(
      props,
      options && selector(options),
      extraOptions && selector(extraOptions)
    );
  };
}

export function retrieveTranslate<T, V extends Validator>(
  ctx: FormState<T, V>,
  config: Config
) {
  let translation = ctx[FORM_TRANSLATION];
  const uiOption = resolveUiOption(ctx, config.uiSchema, "translations");
  translation = uiOption
    ? overrideByRecord(translation, uiOption)
    : translation;
  const extraUiOption = ctx[FORM_EXTRA_UI_OPTIONS]?.("translations", config);
  translation = extraUiOption
    ? overrideByRecord(translation, extraUiOption)
    : translation;
  return createTranslate(translation);
}
