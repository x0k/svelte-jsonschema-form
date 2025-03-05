import { getContext, setContext } from "svelte";

import type { DataURLToBlob } from "@/lib/file.js";
import type { Action } from "@/lib/action.svelte.js";
import type { Schema, SchemaValue } from "@/core/index.js";

import type { Translation } from "../translation.js";
import type { UiOptions, UiSchema, UiSchemaRoot } from "../ui-schema.js";
import type { FieldError, CombinedError, FieldErrorsMap } from "../errors.js";
import type { FormValidator } from "../validator.js";
import type { Icons } from "../icons.js";
import type { FormMerger } from "../merger.js";
import type { Config } from "../config.js";
import type { Theme } from "../components.js";
import type { Id } from "../id.js";
import type { FormValue } from "../model.js";

export interface FormContext<E, FV extends FormValidator<E>> {
  value: FormValue;
  isChanged: boolean;
  readonly rootId: Id;
  readonly fieldsValidationMode: number;
  readonly isSubmitted: boolean;
  readonly schema: Schema;
  readonly uiSchema: UiSchemaRoot;
  readonly uiOptions: UiOptions;
  readonly validator: FV;
  readonly merger: FormMerger;
  readonly icons?: Icons;
  readonly idPrefix: string;
  readonly idSeparator: string;
  readonly idPseudoSeparator: string;
  readonly disabled: boolean;
  readonly errors: FieldErrorsMap<CombinedError<E, FV>>;
  readonly dataUrlToBlob: DataURLToBlob;
  readonly translation: Translation;
  readonly theme: Theme;
  readonly submitHandler: (e: SubmitEvent) => void;
  readonly resetHandler: (e: Event) => void;
  readonly validation: Action<
    [event: SubmitEvent],
    {
      snapshot: SchemaValue | undefined;
      validationErrors: FieldErrorsMap<E>;
    },
    unknown
  >;
  readonly fieldsValidation: Action<
    [config: Config, value: SchemaValue | undefined],
    FieldError<E>[],
    unknown
  >;
}

export const FORM_CONTEXT = Symbol("form-context");

export function getFormContext<VE, V extends FormValidator<VE>>(): FormContext<
  VE,
  V
> {
  return getContext(FORM_CONTEXT);
}

export function setFromContext<VE, V extends FormValidator<VE>>(
  ctx: FormContext<VE, V>
) {
  setContext(FORM_CONTEXT, ctx);
}

export function getUiOptions<VE, V extends FormValidator<VE>>(
  ctx: FormContext<VE, V>,
  uiSchema: UiSchema
) {
  const globalUiOptions = ctx.uiSchema["ui:globalOptions"];
  const uiOptions = uiSchema["ui:options"];
  return globalUiOptions !== undefined
    ? { ...globalUiOptions, ...uiOptions }
    : uiOptions;
}
