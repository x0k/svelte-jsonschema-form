import { getContext, setContext } from "svelte";
import type { SvelteMap } from "svelte/reactivity";

import type { Schema } from "@/core/index.js";
import type { DataURLToBlob } from "@/lib/file.js";
import { noop } from "@/lib/function.js";
import type { DeepPartial } from "@/lib/types.js";

import type { Theme } from "../components.js";
import type { Config } from "../config.js";
import type { FormValidation, FieldsValidation } from "../errors.js";
import type { FieldState } from "../field-state.js";
import type { ResolveFieldType } from "../fields.js";
import type { Icons } from "../icons.js";
import type { FieldPath, Id } from "../id.js";
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
  FORM_FIELDS_STATE_MAP,
  FORM_ID_FROM_PATH,
  FORM_ERRORS,
  FORM_PATHS_TRIE_REF,
  FORM_ROOT_PATH,
  FORM_ID_PREFIX,
  FormErrors,
  FORM_RETRIEVED_SCHEMA,
  FORM_CONFIGS_CACHE,
  FORM_INITIAL_DEFAULTS_GENERATED,
  FORM_INITIAL_VALUE,
} from "../internals.js";
import type { FormMerger } from "../merger.js";
import type { FormValue, KeyedArraysMap, PathTrieRef } from "../model.js";
import type { Translate, Translation } from "../translation.js";
import {
  type ExtraUiOptions,
  type UiOptionsRegistry,
  type UiSchema,
  type UiSchemaRoot,
} from "../ui-schema.js";
import type { FailureValidationResult, FormValidator } from "../validator.js";
import { getValueSnapshot } from "./value.svelte.js";

export interface FormState<T> {
  readonly validation: FormValidation<T>;
  readonly fieldsValidation: FieldsValidation;
  // Internals
  [FORM_VALUE]: FormValue;
  [FORM_INITIAL_DEFAULTS_GENERATED]: boolean;
  readonly [FORM_INITIAL_VALUE]: DeepPartial<T> | undefined;
  readonly [FORM_ID_PREFIX]: string;
  readonly [FORM_ROOT_PATH]: FieldPath;
  readonly [FORM_ID_FROM_PATH]: (path: FieldPath) => Id;
  readonly [FORM_PATHS_TRIE_REF]: PathTrieRef<FieldPath>;
  readonly [FORM_ERRORS]: FormErrors;
  readonly [FORM_MARK_SCHEMA_CHANGE]: () => void;
  readonly [FORM_KEYED_ARRAYS]: KeyedArraysMap;
  readonly [FORM_FIELDS_VALIDATION_MODE]: number;
  readonly [FORM_SCHEMA]: Schema;
  readonly [FORM_RETRIEVED_SCHEMA]: Schema;
  readonly [FORM_UI_SCHEMA_ROOT]: UiSchemaRoot;
  readonly [FORM_UI_SCHEMA]: UiSchema;
  readonly [FORM_UI_OPTIONS_REGISTRY]: UiOptionsRegistry;
  readonly [FORM_UI_EXTRA_OPTIONS]?: ExtraUiOptions;
  readonly [FORM_VALIDATOR]: FormValidator<T>;
  readonly [FORM_MERGER]: FormMerger;
  readonly [FORM_ICONS]?: Icons;
  readonly [FORM_DISABLED]: boolean;
  readonly [FORM_DATA_URL_TO_BLOB]: DataURLToBlob;
  readonly [FORM_TRANSLATION]: Translation;
  readonly [FORM_TRANSLATE]: Translate;
  readonly [FORM_RESOLVER]: ResolveFieldType;
  readonly [FORM_THEME]: Theme;
  readonly [FORM_FIELDS_STATE_MAP]: SvelteMap<FieldPath, FieldState>;
  readonly [FORM_CONFIGS_CACHE]: WeakMap<FieldPath, Config>;
}

export function getFormContext<T>(): FormState<T> {
  return getContext(FORM_CONTEXT);
}

export function setFormContext<T>(form: FormState<T>) {
  setContext(FORM_CONTEXT, form);
}

export interface ValidateHandlers<T, E> {
  onValid?: (value: T) => void;
  onInvalid?: (result: FailureValidationResult) => void;
  onValidationProcessError?: (error: E) => void;
}

export function validate<T>(
  form: FormState<T>,
  handlers: ValidateHandlers<T, unknown> = {}
) {
  const snapshot = getValueSnapshot(form);
  return form.validation.runAsync(snapshot).then((result) => {
    if (result.errors) {
      handlers.onInvalid?.(result);
    } else {
      handlers.onValid?.(result.value);
    }
  }, handlers.onValidationProcessError ?? noop);
}

export function reset<T>(form: FormState<T>) {
  form.validation.clear();
  form.fieldsValidation.clear();
  form[FORM_INITIAL_DEFAULTS_GENERATED] = false;
  form[FORM_FIELDS_STATE_MAP].clear();
  form[FORM_ERRORS].clear();
  form[FORM_VALUE] = form[FORM_MERGER].mergeFormDataAndSchemaDefaults({
    formData: form[FORM_INITIAL_VALUE] as FormValue,
    schema: form[FORM_SCHEMA],
  });
}
