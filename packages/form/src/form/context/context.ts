import { getContext, setContext } from "svelte";

import type { Brand } from "@/lib/types.js";
import type { DataURLToBlob } from "@/lib/file.js";
import type { Schema, Validator } from "@/core/index.js";

import type { Translate, Translation } from "../translation.js";
import {
  type ExtraUiOptions,
  type UiOptionsRegistry,
  type UiSchema,
  type UiSchemaRoot,
} from "../ui-schema.js";
import type {
  PossibleError,
  FieldErrorsMap,
  FormSubmission,
  FieldsValidation,
} from "../errors.js";
import type { Icons } from "../icons.js";
import type { FormMerger } from "../merger.js";
import type { Theme } from "../components.js";
import type { Id, IdOptions } from "../id.js";
import type { FormValue } from "../model.js";
import type { ResolveFieldType } from "../fields.js";

/** @deprecated don't use this type */
export type FormContext = Brand<"sjsf-context", {}>;

export interface FormInternalContext<V extends Validator>
  extends FormContext,
    Readonly<Required<IdOptions>> {
  value: FormValue;
  isChanged: boolean;
  readonly markSchemaChange: () => void;
  readonly rootId: Id;
  readonly fieldsValidationMode: number;
  readonly isSubmitted: boolean;
  readonly schema: Schema;
  readonly uiSchemaRoot: UiSchemaRoot;
  readonly uiSchema: UiSchema;
  readonly uiOptionsRegistry: UiOptionsRegistry;
  readonly extraUiOptions?: ExtraUiOptions;
  readonly validator: V;
  readonly merger: FormMerger;
  readonly icons?: Icons;
  readonly disabled: boolean;
  readonly errors: FieldErrorsMap<PossibleError<V>>;
  readonly dataUrlToBlob: DataURLToBlob;
  readonly translation: Translation;
  readonly translate: Translate;
  readonly fieldTypeResolver: ResolveFieldType;
  readonly theme: Theme;
  readonly submitHandler: (e: SubmitEvent) => void;
  readonly resetHandler: (e: Event) => void;
  readonly submission: FormSubmission<V>;
  readonly fieldsValidation: FieldsValidation<V>;
}

// TODO: Do not export this symbol
/** @deprecated this symbol will become internal */
export const FORM_CONTEXT = Symbol("form-context");

export function getFormContext<V extends Validator>(): FormInternalContext<V> {
  return getContext(FORM_CONTEXT);
}

/** @deprecated use `setFormContext2` */
export function setFormContext(ctx: FormContext) {
  setContext(FORM_CONTEXT, ctx);
}
