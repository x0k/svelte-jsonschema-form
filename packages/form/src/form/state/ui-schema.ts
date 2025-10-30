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
import type { ActionField } from "../field-actions.js";
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
export function retrieveUiSchema<I, O>(
  ctx: FormState<I, O>,
  uiSchemaDef: UiSchemaDefinition | undefined
) {
  return resolveUiRef(ctx[FORM_UI_SCHEMA_ROOT], uiSchemaDef) ?? {};
}

function resolveUiOption<In, Out, O extends keyof UiOptions>(
  ctx: FormState<In, Out>,
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
export function uiTitleOption<I, O>(ctx: FormState<I, O>, uiSchema: UiSchema) {
  return resolveUiOption(ctx, uiSchema, "title");
}

/**
 * @query
 */
export function retrieveUiOption<In, Out, const O extends keyof UiOptions>(
  ctx: FormState<In, Out>,
  config: Config,
  option: O
) {
  return (
    ctx[FORM_UI_EXTRA_OPTIONS]?.(option, config) ??
    resolveUiOption(ctx, config.uiSchema, option)
  );
}

/**
 * NOTE: An extra option will take precedence
 * @query
 */
export function retrieveNestedUiOption<In, Out, const O extends keyof UiOptions, R>(
  ctx: FormState<In, Out>,
  config: Config,
  option: O,
  selector: (data: NonNullable<UiOptions[O]>) => R | undefined
) {
  const extraOptions = ctx[FORM_UI_EXTRA_OPTIONS]?.(option, config as never);
  if (extraOptions) {
    const selected = selector(extraOptions);
    if (selected !== undefined) {
      return selected;
    }
  }
  const options = resolveUiOption(ctx, config.uiSchema, option);
  if (options !== undefined) {
    return selector(options);
  }
  return undefined;
}

export type ObjectUiOptions = ObjectProperties<UiOptions>;

/**
 * @query
 */
export function uiOptionProps<const O extends keyof ObjectUiOptions>(
  option: O
) {
  return <In, Out>(
    props: NonNullable<UiOptions[O]>,
    config: Config,
    ctx: FormState<In, Out>
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
  return <In, Out>(props: R, config: Config, ctx: FormState<In, Out>): R => {
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
export function retrieveTranslate<I, O>(ctx: FormState<I, O>, config: Config) {
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
export function getFieldTitle<I, O>(ctx: FormState<I, O>, path: RPath) {
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

/**
 * @query
 */
export function getFieldAction<In, Out, const F extends ActionField>(
  ctx: FormState<In, Out>,
  config: Config,
  field: F,
) {
  const action = retrieveNestedUiOption(
    ctx,
    config,
    "actions",
    (a) => a[field]
  );
  if (action !== undefined) {
    return action;
  }
  return retrieveUiOption(ctx, config, "action");
}
