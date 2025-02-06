import { getContext, setContext, type Component, type Snippet } from "svelte";
import type { EventHandler, FormEventHandler } from "svelte/elements";

import type { DataURLToBlob } from "@/lib/file.js";
import type { Schema, SchemaValue } from "@/core/index.js";
import type { Mutation } from "@/use-mutation.svelte.js";

import type { Label, Labels, Translation } from "../translation.js";
import type { UiSchema, UiSchemaRoot } from "../ui-schema.js";
import type { ComponentsResolver } from "../component.js";
import type { WidgetsResolver } from "../widgets.js";
import type { FieldsResolver } from "../fields/index.js";
import type { TemplatesResolver } from "../templates/index.js";
import type { Errors } from "../errors.js";
import type { FormValidator2, ValidationError } from "../validator.js";
import type { Icons } from "../icons.js";
import type { FormMerger } from "../merger.js";
import type { Config } from "../config.js";

export type IconOrTranslationData = {
  [L in Label]: [L, ...Labels[L]];
}[Label];

export interface FormContext {
  isSubmitted: boolean;
  isChanged: boolean;
  fieldsValidationMode: number;
  submitHandler: EventHandler<SubmitEvent, HTMLFormElement>;
  resetHandler: FormEventHandler<HTMLFormElement>;
  schema: Schema;
  uiSchema: UiSchemaRoot;
  validator: FormValidator2;
  merger: FormMerger;
  field: FieldsResolver;
  component: ComponentsResolver;
  widget: WidgetsResolver;
  translation: Translation;
  template: TemplatesResolver;
  icons: Icons;
  idPrefix: string;
  idSeparator: string;
  idPseudoSeparator: string;
  disabled: boolean;
  errors: Errors;
  dataUrlToBlob: DataURLToBlob;
  IconOrTranslation: Component<{ data: IconOrTranslationData }>;
  /** @deprecated use `IconOrTranslation` instead */
  iconOrTranslation: Snippet<[IconOrTranslationData]>;
  validateAdditionalPropertyKey(
    config: Config,
    key: string,
    fieldConfig: Config
  ): boolean;
  validation: Mutation<
    [event: SubmitEvent],
    {
      snapshot: SchemaValue | undefined;
      validationErrors: Errors;
    },
    unknown
  >;
  fieldsValidation: Mutation<
    [config: Config<unknown>, value: SchemaValue | undefined],
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
