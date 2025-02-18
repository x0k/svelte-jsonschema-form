import { getContext, setContext, type Component } from "svelte";
import type { EventHandler, FormEventHandler } from "svelte/elements";

import type { DataURLToBlob } from "@/lib/file.js";
import type { Action } from "@/lib/action.svelte.js";
import type { Schema, SchemaValue } from "@/core/index.js";

import type { Label, Labels, Translation } from "../translation.js";
import type { UiOptions, UiSchema, UiSchemaRoot } from "../ui-schema.js";
import type { FormErrors } from "../errors.js";
import type { FormValidator, ValidationError } from "../validator.js";
import type { Icons, IconsResolver } from "../icons.js";
import type { FormMerger } from "../merger.js";
import type { Config } from "../config.js";
import type { ThemeResolver } from "../theme.js";
import type { Id } from "../id.js";
import type { FormValue } from "../model.js";

export interface FormContext<E> {
  value: FormValue;
  isChanged: boolean;
  readonly rootId: Id;
  readonly fieldsValidationMode: number;
  readonly isSubmitted: boolean;
  readonly schema: Schema;
  readonly uiSchema: UiSchemaRoot;
  readonly uiOptions: UiOptions;
  readonly validator: FormValidator<E>;
  readonly merger: FormMerger;
  readonly icons?: IconsResolver;
  readonly idPrefix: string;
  readonly idSeparator: string;
  readonly idPseudoSeparator: string;
  readonly disabled: boolean;
  readonly errors: FormErrors<E>;
  readonly dataUrlToBlob: DataURLToBlob;
  readonly translation: Translation;
  readonly theme: ThemeResolver;
  readonly submitHandler: EventHandler<SubmitEvent, HTMLFormElement>;
  readonly resetHandler: FormEventHandler<HTMLFormElement>;
  readonly validateAdditionalPropertyKey: (
    config: Config,
    key: string,
    fieldConfig: Config
  ) => boolean;
  readonly validation: Action<
    [event: SubmitEvent],
    {
      snapshot: SchemaValue | undefined;
      validationErrors: FormErrors<E>;
    },
    unknown
  >;
  readonly fieldsValidation: Action<
    [config: Config, value: SchemaValue | undefined],
    ValidationError<unknown>[],
    unknown
  >;
}

export const FORM_CONTEXT = Symbol("form-context");

export function getFormContext<E>(): FormContext<E> {
  return getContext(FORM_CONTEXT);
}

export function setFromContext<E>(ctx: FormContext<E>) {
  setContext(FORM_CONTEXT, ctx);
}

export function getUiOptions<E>(ctx: FormContext<E>, uiSchema: UiSchema) {
  const globalUiOptions = ctx.uiSchema["ui:globalOptions"];
  const uiOptions = uiSchema["ui:options"];
  return globalUiOptions !== undefined
    ? { ...globalUiOptions, ...uiOptions }
    : uiOptions;
}
