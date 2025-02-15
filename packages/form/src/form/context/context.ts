import { getContext, setContext, type Component, type Snippet } from "svelte";
import type { EventHandler, FormEventHandler } from "svelte/elements";

import type { DataURLToBlob } from "@/lib/file.js";
import type { Schema, SchemaValue } from "@/core/index.js";
import type { Action } from "@/create-action.svelte.js";

import type { Label, Labels, Translation } from "../translation.js";
import type { UiOptions, UiSchema, UiSchemaRoot } from "../ui-schema.js";
import type { FormErrors } from "../errors.js";
import type { FormValidator2, ValidationError } from "../validator.js";
import type { Icons } from "../icons.js";
import type { FormMerger } from "../merger.js";
import type { Config } from "../config.js";
import type { ThemeResolver } from "../theme.js";
import type { Id } from "../id.js";
import type { FormValue } from "../model.js";

export type IconOrTranslationData = {
  [L in Label]: [L, ...Labels[L]];
}[Label];

export interface FormContext {
  rootId: Id;
  value: FormValue;
  isSubmitted: boolean;
  isChanged: boolean;
  fieldsValidationMode: number;
  submitHandler: EventHandler<SubmitEvent, HTMLFormElement>;
  resetHandler: FormEventHandler<HTMLFormElement>;
  schema: Schema;
  uiSchema: UiSchemaRoot;
  uiOptions: UiOptions;
  validator: FormValidator2;
  merger: FormMerger;
  translation: Translation;
  theme: ThemeResolver;
  icons: Icons;
  idPrefix: string;
  idSeparator: string;
  idPseudoSeparator: string;
  disabled: boolean;
  errors: FormErrors;
  dataUrlToBlob: DataURLToBlob;
  IconOrTranslation: Component<{ data: IconOrTranslationData }>;
  validateAdditionalPropertyKey(
    config: Config,
    key: string,
    fieldConfig: Config
  ): boolean;
  validation: Action<
    [event: SubmitEvent],
    {
      snapshot: SchemaValue | undefined;
      validationErrors: FormErrors;
    },
    unknown
  >;
  fieldsValidation: Action<
    [config: Config, value: SchemaValue | undefined],
    ValidationError<unknown>[],
    unknown
  >;
}

export const FORM_CONTEXT = Symbol("form-context");

export function getFormContext(): FormContext {
  return getContext(FORM_CONTEXT);
}

export function setFromContext(ctx: FormContext) {
  setContext(FORM_CONTEXT, ctx);
}

export function getUiOptions(ctx: FormContext, uiSchema: UiSchema) {
  const globalUiOptions = ctx.uiSchema["ui:globalOptions"];
  const uiOptions = uiSchema["ui:options"];
  return globalUiOptions !== undefined
    ? { ...globalUiOptions, ...uiOptions }
    : uiOptions;
}
