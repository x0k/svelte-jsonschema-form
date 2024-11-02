import { getContext, setContext, type Component, type Snippet } from "svelte";

import type { SchedulerYield } from "@/lib/scheduler.js";

import type { Schema, SchemaValue } from "@/core/index.js";

import type { Label, Labels, Translation } from "../translation.js";
import type { UiSchema, UiSchemaRoot } from "../ui-schema.js";
import type { Components } from "../component.js";
import type { Widgets } from "../widgets.js";
import type { Fields } from "../fields/index.js";
import type { Templates } from "../templates/index.js";
import type { Errors } from "../errors.js";
import type { FormValidator } from "../validator.js";
import type { Icons } from "../icons.js";
import { type IdSchema, toIdSchema2 } from "../id-schema.js";
import type { FormMerger } from "../merger.js";

export type IconOrTranslationData = {
  [L in Label]: [L, ...Labels[L]];
}[Label]

export interface FormContext {
  isSubmitted: boolean;
  isChanged: boolean;
  inputsValidationMode: number;
  schema: Schema;
  uiSchema: UiSchemaRoot;
  validator: FormValidator;
  merger: FormMerger;
  fields: Fields;
  components: Components;
  widgets: Widgets;
  translation: Translation;
  templates: Templates;
  icons: Icons;
  disabled: boolean;
  idPrefix: string;
  idSeparator: string;
  errors: Errors;
  schedulerYield: SchedulerYield;
  /** @deprecated use `IconOrTranslation` instead */
  iconOrTranslation: Snippet<[IconOrTranslationData]>;
  IconOrTranslation: Component<{ data: IconOrTranslationData }>;
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

export function makeIdSchema(
  ctx: FormContext,
  schema: Schema,
  id?: string,
  formData?: SchemaValue
): IdSchema<SchemaValue> {
  return toIdSchema2(
    ctx.validator,
    ctx.merger,
    schema,
    ctx.idPrefix,
    ctx.idSeparator,
    [],
    id,
    ctx.schema,
    formData
  );
}
