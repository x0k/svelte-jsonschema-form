import { getContext, setContext, type Component, type Snippet } from "svelte";

import type { SchedulerYield } from "@/lib/scheduler.js";
import type { Schema, SchemaValue } from "@/core/index.js";
import type { Mutation } from '@/use-mutation.svelte.js';

import type { Label, Labels, Translation } from "../translation.js";
import type { UiSchema, UiSchemaRoot } from "../ui-schema.js";
import type { Components } from "../component.js";
import type { Widgets } from "../widgets.js";
import type { Fields } from "../fields/index.js";
import type { Templates } from "../templates/index.js";
import type { Errors } from "../errors.js";
import type { FormValidator2, ValidationError } from "../validator.js";
import type { Icons } from "../icons.js";
import type { FormMerger } from "../merger.js";
import type { Config } from '../config.js';

export type IconOrTranslationData = {
  [L in Label]: [L, ...Labels[L]];
}[Label];

export interface FormContext {
  isSubmitted: boolean;
  isChanged: boolean;
  fieldsValidationMode: number;
  schema: Schema;
  uiSchema: UiSchemaRoot;
  validator: FormValidator2;
  merger: FormMerger;
  fields: Fields;
  components: Components;
  widgets: Widgets;
  translation: Translation;
  templates: Templates;
  icons: Icons;
  idPrefix: string;
  idSeparator: string;
  idPseudoSeparator: string;
  disabled: boolean;
  errors: Errors;
  schedulerYield: SchedulerYield;
  IconOrTranslation: Component<{ data: IconOrTranslationData }>;
  /** @deprecated use `IconOrTranslation` instead */
  iconOrTranslation: Snippet<[IconOrTranslationData]>;
  validateAdditionalPropertyKey(config: Config, key: string, fieldConfig: Config): boolean;
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

const FORM_CONTEXT = Symbol("form-context");

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
