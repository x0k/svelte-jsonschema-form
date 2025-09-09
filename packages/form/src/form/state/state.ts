import { getContext, setContext } from "svelte";

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
import type { FormValue, KeyedArraysMap } from "../model.js";
import type { ResolveFieldType } from "../fields.js";
import {
  FORM_CONTEXT,
  FORM_DATA_URL_TO_BLOB,
  FORM_DISABLED,
  FORM_EXTRA_UI_OPTIONS,
  FORM_RESOLVER,
  FORM_FIELDS_VALIDATION_MODE,
  FORM_ICONS,
  FORM_KEYED_ARRAYS,
  FORM_MARK_SCHEMA_CHANGE,
  FORM_MERGER,
  FORM_SCHEMA,
  FORM_THEME,
  FORM_TRANSLATE,
  FORM_TRANSLATION,
  FORM_UI_OPTIONS_REGISTRY,
  FORM_UI_SCHEMA,
  FORM_UI_SCHEMA_ROOT,
  FORM_VALIDATOR,
  FORM_VALUE,
} from "../internals.js";
import type { IdOptions } from "../id.js";

export interface FormState<T, V extends Validator>
  extends Readonly<Required<IdOptions>> {
  readonly submission: FormSubmission<V>;
  readonly fieldsValidation: FieldsValidation<V>;
  /**
   * An accessor that maintains form state consistency:
   *
   * - A snapshot of the form state is returned on access
   * - Default values from JSON Schema are taken into account during assignment
   */
  value: T | undefined;
  isSubmitted: boolean;
  isChanged: boolean;
  errors: FieldErrorsMap<PossibleError<V>>;
  submit: (e: SubmitEvent) => void;
  reset: (e: Event) => void;

  [FORM_VALUE]: FormValue;
  readonly [FORM_MARK_SCHEMA_CHANGE]: () => void;
  readonly [FORM_KEYED_ARRAYS]: KeyedArraysMap;
  readonly [FORM_FIELDS_VALIDATION_MODE]: number;
  readonly [FORM_SCHEMA]: Schema;
  readonly [FORM_UI_SCHEMA_ROOT]: UiSchemaRoot;
  readonly [FORM_UI_SCHEMA]: UiSchema;
  readonly [FORM_UI_OPTIONS_REGISTRY]: UiOptionsRegistry;
  readonly [FORM_EXTRA_UI_OPTIONS]?: ExtraUiOptions;
  readonly [FORM_VALIDATOR]: V;
  readonly [FORM_MERGER]: FormMerger;
  readonly [FORM_ICONS]?: Icons;
  readonly [FORM_DISABLED]: boolean;
  readonly [FORM_DATA_URL_TO_BLOB]: DataURLToBlob;
  readonly [FORM_TRANSLATION]: Translation;
  readonly [FORM_TRANSLATE]: Translate;
  readonly [FORM_RESOLVER]: ResolveFieldType;
  readonly [FORM_THEME]: Theme;
}

export function getFormContext<T, V extends Validator>(): FormState<T, V> {
  return getContext(FORM_CONTEXT);
}

export function setFormContext<T, V extends Validator>(form: FormState<T, V>) {
  setContext(FORM_CONTEXT, form);
}

// TODO: Remove in v4
/** @deprecated use `setFormContext` */
export const setFormContext2 = setFormContext;
