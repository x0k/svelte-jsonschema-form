import { getContext, setContext } from "svelte";

import type { Validator } from "@/core/schema";
import type { Translation } from "@/core/translation";
import type { Schema, ValidationError } from "@/core/schema";
import type { UiSchemaRoot } from "@/core/ui-schema";

import type { Components } from "./component";
import type { Fields } from "./fields";
import type { Widgets } from "./widgets";
import type { Templates } from "./templates";

export interface FormContext {
  schema: Schema;
  uiSchema: UiSchemaRoot;
  validator: Validator;
  fields: Fields;
  components: Components;
  widgets: Widgets;
  translation: Translation;
  templates: Templates;
  disabled: boolean;
  readonly: boolean;
  idPrefix: string;
  idSeparator: string;
  validationErrors: Map<string, ValidationError<unknown>[]>;
}

const FORM_CONTEXT = Symbol("form-context");

export function getFormContext(): FormContext {
  return getContext(FORM_CONTEXT);
}

export function setFromContext(ctx: FormContext) {
  setContext(FORM_CONTEXT, ctx);
}
