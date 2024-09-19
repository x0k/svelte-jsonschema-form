import { getContext, setContext } from "svelte";

import type { Components } from "./component";
import type { Schema, Validator } from "./schema";
import type { Translator } from "./translation";
import type { UiSchema } from "./ui-schema";

export interface FormContext<T> {
  schema: Schema;
  uiSchema: UiSchema;
  validator: Validator<T>;
  components: Components;
  translator: Translator;
  disabled: boolean;
  readonly: boolean;
}

const FORM_CONTEXT = Symbol("form-context");

export function getFormContext<T>(): FormContext<T> {
  return getContext(FORM_CONTEXT);
}

export function setFromContext<T>(ctx: FormContext<T>) {
  setContext(FORM_CONTEXT, ctx);
}
