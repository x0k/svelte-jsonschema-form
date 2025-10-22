import type { SvelteMap } from "svelte/reactivity";

import { getNodeByKeys, insertValue } from "@/lib/trie.js";
import type { RPath } from "@/core/index.js";

import type { FormErrorsMap } from "./errors.js";
import type { ValidationError } from "./validator.js";
import type { PathTrieRef } from "./model.js";
import type { FieldPath } from "./id.js";
import type { FieldState } from "./field-state.js";

export const FORM_CONTEXT = Symbol("form-context");

export const FORM_VALUE = Symbol("form-value");

export const FORM_ID_PREFIX = Symbol("form-id-prefix");
export const FORM_ERRORS = Symbol("form-errors");
export const FORM_ID_FROM_PATH = Symbol("form-id-from-path");
export const FORM_PATHS_TRIE_REF = Symbol("form-paths-trie-ref");
export const FORM_MARK_SCHEMA_CHANGE = Symbol("form-mark-schema-change");
export const FORM_KEYED_ARRAYS = Symbol("form-keyed-arrays");
export const FORM_FIELDS_VALIDATION_MODE = Symbol(
  "form-fields-validation-mode"
);
export const FORM_SCHEMA = Symbol("form-schema");
export const FORM_ROOT_PATH = Symbol("form-root-path");
export const FORM_UI_SCHEMA_ROOT = Symbol("form-ui-schema-root");
export const FORM_UI_SCHEMA = Symbol("form-ui-schema");
export const FORM_UI_OPTIONS_REGISTRY = Symbol("form-ui-options-registry");
export const FORM_UI_EXTRA_OPTIONS = Symbol("form-ui-extra-options");
export const FORM_VALIDATOR = Symbol("form-validator");
export const FORM_MERGER = Symbol("form-merger");
export const FORM_ICONS = Symbol("form-icons");
export const FORM_DISABLED = Symbol("form-disabled");
export const FORM_DATA_URL_TO_BLOB = Symbol("form-data-url-to-blob");
export const FORM_TRANSLATION = Symbol("form-translation");
export const FORM_TRANSLATE = Symbol("form-translate");
export const FORM_RESOLVER = Symbol("form-resolver");
export const FORM_THEME = Symbol("form-theme");
export const FORM_FIELDS_STATE_MAP = Symbol("form-fields-state-map");

export function internalRegisterFieldPath(
  ref: PathTrieRef<FieldPath>,
  path: RPath
): FieldPath {
  const p = path as unknown as FieldPath;
  const node = getNodeByKeys(ref.current, path);
  if (node === undefined) {
    ref.current = insertValue(ref.current, path, p);
  } else {
    const v = node.value;
    if (v !== undefined) {
      return v;
    }
    node.value = p;
  }
  return p;
}

export function internalAssignErrors(
  ref: PathTrieRef<FieldPath>,
  map: FormErrorsMap,
  errors: ReadonlyArray<ValidationError>
): FormErrorsMap {
  map.clear();
  for (const { path, message } of errors) {
    const p = internalRegisterFieldPath(ref, path);
    const arr = map.get(p);
    if (arr) {
      arr.push(message);
    } else {
      map.set(p, [message]);
    }
  }
  return map;
}

export function internalHasFieldState(
  map: SvelteMap<FieldPath, FieldState>,
  path: FieldPath,
  state: FieldState
) {
  return ((map.get(path) ?? 0) & state) > 0;
}
