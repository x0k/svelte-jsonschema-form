import { getContext, setContext } from "svelte";

import type { Brand } from "@/lib/types.js";
import type { Action } from "@/lib/action.svelte.js";
import type { DataURLToBlob } from "@/lib/file.js";
import type { Schema, SchemaValue, Validator } from "@/core/index.js";

import type { Translation } from "../translation.js";
import type { UiOptions, UiSchema, UiSchemaRoot } from "../ui-schema.js";
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
import type { Id } from "../id.js";
import type { FormValue } from "../model.js";

export type FormInternals = Brand<"sjsf-internals", {}>;

export interface FormContext<V extends Validator> extends FormInternals {
  value: FormValue;
  isChanged: boolean;
  readonly rootId: Id;
  readonly fieldsValidationMode: number;
  readonly isSubmitted: boolean;
  readonly schema: Schema;
  readonly uiSchema: UiSchemaRoot;
  readonly uiOptions: UiOptions;
  readonly validator: V;
  readonly merger: FormMerger;
  readonly icons?: Icons;
  readonly idPrefix: string;
  readonly idSeparator: string;
  readonly idPseudoSeparator: string;
  readonly disabled: boolean;
  readonly errors: FieldErrorsMap<PossibleError<V>>;
  readonly dataUrlToBlob: DataURLToBlob;
  readonly translation: Translation;
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

export function getFormContext<V extends Validator>(): FormContext<V> {
  return getContext(FORM_CONTEXT);
}

export function setFromContext(ctx: FormInternals) {
  setContext(FORM_CONTEXT, ctx);
}

export function getUiOptions<V extends Validator>(
  ctx: FormContext<V>,
  uiSchema: UiSchema
) {
  const globalUiOptions = ctx.uiSchema["ui:globalOptions"];
  const uiOptions = uiSchema["ui:options"];
  return globalUiOptions !== undefined
    ? { ...globalUiOptions, ...uiOptions }
    : uiOptions;
}
