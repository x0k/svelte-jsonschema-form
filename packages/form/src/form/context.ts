import { getContext, setContext } from "svelte";

import type { Validator, Schema, ValidationError } from "@/core/index.js";
import type { Translation } from "./translation.js";
import type { UiSchemaRoot } from "./ui-schema.js";

import type { Components } from "./component.js";
import type { Widgets } from "./widgets.js";
import type { Fields } from "./fields/index.js";
import type { Templates } from "./templates/index.js";

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
