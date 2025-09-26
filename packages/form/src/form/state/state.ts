import { getContext, setContext } from "svelte";
import type { SvelteMap } from "svelte/reactivity";

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
  FormErrorsMap,
  FormSubmission,
  FieldsValidation,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  InvalidValidatorError,
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
  FORM_UI_EXTRA_OPTIONS,
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
  FORM_ROOT_ID,
  FORM_FIELDS_STATE_MAP,
  FORM_ID_BUILDER,
} from "../internals.js";
import type { FormIdBuilder, Id } from "../id.js";
import type { FieldState } from "../field-state.js";
import type { ValidationError } from "../validator.js";

export interface FormState<T, V extends Validator> {
  readonly submission: FormSubmission;
  readonly fieldsValidation: FieldsValidation;
  readonly isChanged: boolean;
  readonly isSubmitted: boolean;
  /**
   * An accessor that maintains form state consistency:
   *
   * - A snapshot of the form state is returned on access
   * - Default values from JSON Schema are taken into account during assignment
   */
  value: T | undefined;
  errors: FormErrorsMap;
  submit: (e: SubmitEvent) => void;
  reset: (e: Event) => void;
  /**
   * Performs the following actions:
   * - Takes a snapshot of the current state
   * - Calls the corresponding validator method
   *
   * Actions it does not perform:
   * - Groups errors
   * - Updates the form error list
   *
   * @throws {InvalidValidatorError} If the validator does not have the corresponding method
   */
  validate: () => ValidationError[];
  validateAsync: (signal: AbortSignal) => Promise<ValidationError[]>;

  /** Internals */

  [FORM_VALUE]: FormValue;
  readonly [FORM_ID_BUILDER]: FormIdBuilder;
  readonly [FORM_ROOT_ID]: Id;
  readonly [FORM_MARK_SCHEMA_CHANGE]: () => void;
  readonly [FORM_KEYED_ARRAYS]: KeyedArraysMap;
  readonly [FORM_FIELDS_VALIDATION_MODE]: number;
  readonly [FORM_SCHEMA]: Schema;
  readonly [FORM_UI_SCHEMA_ROOT]: UiSchemaRoot;
  readonly [FORM_UI_SCHEMA]: UiSchema;
  readonly [FORM_UI_OPTIONS_REGISTRY]: UiOptionsRegistry;
  readonly [FORM_UI_EXTRA_OPTIONS]?: ExtraUiOptions;
  readonly [FORM_VALIDATOR]: V;
  readonly [FORM_MERGER]: FormMerger;
  readonly [FORM_ICONS]?: Icons;
  readonly [FORM_DISABLED]: boolean;
  readonly [FORM_DATA_URL_TO_BLOB]: DataURLToBlob;
  readonly [FORM_TRANSLATION]: Translation;
  readonly [FORM_TRANSLATE]: Translate;
  readonly [FORM_RESOLVER]: ResolveFieldType;
  readonly [FORM_THEME]: Theme;
  readonly [FORM_FIELDS_STATE_MAP]: SvelteMap<Id, FieldState>;
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
