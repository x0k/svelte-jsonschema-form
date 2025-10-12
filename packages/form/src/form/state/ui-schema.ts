import type { ObjectProperties } from "@/lib/types.js";
import { overrideByRecord } from "@/lib/resolver.js";
import { getSchemaDefinitionByPath, type RPath } from "@/core/path.js";

import type { Config } from "../config.js";
import {
  resolveUiRef,
  type UiSchema,
  type UiSchemaDefinition,
  resolveUiOption as resolveUiOptionInternal,
  type UiOptions,
  getUiSchemaByPath,
} from "../ui-schema.js";
import { createTranslate } from "../translation.js";
import {
  FORM_UI_EXTRA_OPTIONS,
  FORM_TRANSLATION,
  FORM_UI_OPTIONS_REGISTRY,
  FORM_UI_SCHEMA_ROOT,
  FORM_SCHEMA,
  FORM_VALIDATOR,
  FORM_MERGER,
  FORM_VALUE,
} from "../internals.js";
import type { FormState } from "./state.js";

/**
 * @query
 */
export function retrieveUiSchema<T>(
  ctx: FormState<T>,
  uiSchemaDef: UiSchemaDefinition | undefined
) {
  return resolveUiRef(ctx[FORM_UI_SCHEMA_ROOT], uiSchemaDef) ?? {};
}

function resolveUiOption<T, O extends keyof UiOptions>(
  ctx: FormState<T>,
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

/**
 * @query
 */
export function uiTitleOption<T>(ctx: FormState<T>, uiSchema: UiSchema) {
  return resolveUiOption(ctx, uiSchema, "title");
}

/**
 * @query
 */
export function retrieveUiOption<T, const O extends keyof UiOptions>(
  ctx: FormState<T>,
  config: Config,
  option: O
) {
  return (
    ctx[FORM_UI_EXTRA_OPTIONS]?.(option, config) ??
    resolveUiOption(ctx, config.uiSchema, option)
  );
}

export type ObjectUiOptions = ObjectProperties<UiOptions>;

/**
 * @query
 */
export function uiOptionProps<const O extends keyof ObjectUiOptions>(
  option: O
) {
  return <T>(
    props: NonNullable<UiOptions[O]>,
    config: Config,
    ctx: FormState<T>
  ): NonNullable<UiOptions[O]> => {
    return Object.assign(
      props,
      resolveUiOption(ctx, config.uiSchema, option),
      ctx[FORM_UI_EXTRA_OPTIONS]?.(option, config as never)
    );
  };
}

/**
 * @query
 */
export function uiOptionNestedProps<
  const O extends keyof ObjectUiOptions,
  R extends object,
>(option: O, selector: (data: NonNullable<UiOptions[O]>) => R | undefined) {
  return <T>(props: R, config: Config, ctx: FormState<T>): R => {
    const options = resolveUiOption(ctx, config.uiSchema, option);
    const extraOptions = ctx[FORM_UI_EXTRA_OPTIONS]?.(option, config as never);
    return Object.assign(
      props,
      options && selector(options),
      extraOptions && selector(extraOptions)
    );
  };
}

/**
 * @query
 */
export function retrieveTranslate<T>(ctx: FormState<T>, config: Config) {
  let translation = ctx[FORM_TRANSLATION];
  const uiOption = resolveUiOption(ctx, config.uiSchema, "translations");
  translation = uiOption
    ? overrideByRecord(translation, uiOption)
    : translation;
  const extraUiOption = ctx[FORM_UI_EXTRA_OPTIONS]?.("translations", config);
  translation = extraUiOption
    ? overrideByRecord(translation, extraUiOption)
    : translation;
  return createTranslate(translation);
}

/**
 * @query
 */
export function getFieldTitle<T>(ctx: FormState<T>, path: RPath) {
  const uiSchema = getUiSchemaByPath(
    ctx[FORM_UI_SCHEMA_ROOT],
    ctx[FORM_UI_SCHEMA_ROOT],
    path
  );
  if (uiSchema !== undefined) {
    const resolved = resolveUiOption(ctx, uiSchema, "title");
    if (resolved !== undefined) {
      return resolved;
    }
  }
  const def = getSchemaDefinitionByPath(
    ctx[FORM_VALIDATOR],
    ctx[FORM_MERGER],
    ctx[FORM_SCHEMA],
    ctx[FORM_SCHEMA],
    path,
    ctx[FORM_VALUE]
  );
  return typeof def === "object" ? def.title : undefined;
}
