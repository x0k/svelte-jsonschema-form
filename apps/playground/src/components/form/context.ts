import { getContext, setContext } from "svelte";

import type { Components } from "./component";
import type { Schema, Validator } from "./schema";
import type { Translation } from "./translation";
import type { UiSchemaRoot } from "./ui-schema";
import type { Fields } from "./fields";
import type { Widgets } from "./widgets";
import type { Templates } from "./templates";

export interface FormContext<T> {
  schema: Schema;
  uiSchema: UiSchemaRoot;
  validator: Validator<T>;
  fields: Fields;
  components: Components;
  widgets: Widgets;
  translation: Translation;
  templates: Templates;
  disabled: boolean;
  readonly: boolean;
  idPrefix: string;
  idSeparator: string;
}

const FORM_CONTEXT = Symbol("form-context");

export function getFormContext<T>(): FormContext<T> {
  return getContext(FORM_CONTEXT);
}

export function setFromContext<T>(ctx: FormContext<T>) {
  setContext(FORM_CONTEXT, ctx);
}
