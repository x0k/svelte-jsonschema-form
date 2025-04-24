import { getContext, setContext } from "svelte";

import type { Brand } from "@/lib/types.js";
import type { Action } from "@/lib/action.svelte.js";
import type { DataURLToBlob } from "@/lib/file.js";
import type { Schema, SchemaValue, Validator } from "@/core/index.js";

import type { Translation } from "../translation.js";
import {
  resolveUiRef,
  type ExtraUiOptions,
  type UiOptions,
  type UiSchema,
  type UiSchemaDefinition,
  type UiSchemaRoot,
} from "../ui-schema.js";
import type {
  FieldError,
  PossibleError,
  FieldErrorsMap,
  AnyFormValueValidatorError,
  AnyFieldValueValidatorError,
} from "../errors.js";
import type { Icons } from "../icons.js";
import type { FormMerger } from "../merger.js";
import type { Config } from "../config.js";
import type { Theme } from "../components.js";
import type { Id, IdOptions } from "../id.js";
import {
  resolveValue,
  type FormValue,
  type Resolvable,
  type ValuesRegistry,
} from "../model.js";
import type { ResolveFieldType } from "../fields.js";

export type FormContext = Brand<"sjsf-context", {}>;

export interface FormInternalContext<V extends Validator>
  extends FormContext,
    Readonly<Required<IdOptions>> {
  value: FormValue;
  isChanged: boolean;
  readonly rootId: Id;
  readonly fieldsValidationMode: number;
  readonly isSubmitted: boolean;
  readonly schema: Schema;
  readonly uiSchemaRoot: UiSchemaRoot;
  readonly uiSchema: UiSchema;
  readonly uiOptions: UiOptions;
  readonly extraUiOptions?: ExtraUiOptions;
  readonly validator: V;
  readonly merger: FormMerger;
  readonly registry: ValuesRegistry;
  readonly icons?: Icons;
  readonly disabled: boolean;
  readonly errors: FieldErrorsMap<PossibleError<V>>;
  readonly dataUrlToBlob: DataURLToBlob;
  readonly translation: Translation;
  readonly fieldTypeResolver: ResolveFieldType;
  readonly theme: Theme;
  readonly submitHandler: (e: SubmitEvent) => void;
  readonly resetHandler: (e: Event) => void;
  readonly validation: Action<
    [event: SubmitEvent],
    {
      snapshot: SchemaValue | undefined;
      validationErrors: FieldErrorsMap<AnyFormValueValidatorError<V>>;
    },
    unknown
  >;
  readonly fieldsValidation: Action<
    [config: Config, value: SchemaValue | undefined],
    FieldError<AnyFieldValueValidatorError<V>>[],
    unknown
  >;
}

export const FORM_CONTEXT = Symbol("form-context");

export function getFormContext<V extends Validator>(): FormInternalContext<V> {
  return getContext(FORM_CONTEXT);
}

export function setFromContext(ctx: FormContext) {
  setContext(FORM_CONTEXT, ctx);
}

export function retrieveUiSchema<V extends Validator>(
  ctx: FormInternalContext<V>,
  uiSchemaDef: UiSchemaDefinition | undefined
) {
  return resolveUiRef(ctx.uiSchemaRoot, uiSchemaDef) ?? {};
}


export function retrieveValue<V extends Validator, T>(
  ctx: FormInternalContext<V>,
  val: Resolvable<T>
) {
  return resolveValue(ctx.registry, val);
}

export function retrieveUiOption<V extends Validator, O extends keyof UiOptions>(
  ctx: FormInternalContext<V>,
  config: Config,
  option: O
) {
  const val = ctx.extraUiOptions?.(option, config) ?? config.uiOptions?.[option];
  if (val === undefined) {
    return undefined
  }
  return retrieveValue(ctx, val)
}

export function getUiOptions<V extends Validator>(
  ctx: FormInternalContext<V>,
  uiSchema: UiSchema
) {
  const globalUiOptions = ctx.uiSchemaRoot["ui:globalOptions"];
  const uiOptions = uiSchema["ui:options"];
  return globalUiOptions !== undefined
    ? { ...globalUiOptions, ...uiOptions }
    : uiOptions;
}
