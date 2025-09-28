import { SvelteMap } from "svelte/reactivity";

import type { Path } from "@/core/path.js";

import { tryGetPseudoElement, type FormIdBuilder, type Id } from "./id.js";
import type { FormErrorsMap } from "./errors.js";
import type { ValidationError } from "./validator.js";

export const FORM_CONTEXT = Symbol("form-context");

export const FORM_VALUE = Symbol("form-value");

export const FORM_ID_BUILDER = Symbol("form-id-builder");
export const FORM_MARK_SCHEMA_CHANGE = Symbol("form-mark-schema-change");
export const FORM_KEYED_ARRAYS = Symbol("form-keyed-arrays");
export const FORM_FIELDS_VALIDATION_MODE = Symbol(
  "form-fields-validation-mode"
);
export const FORM_SCHEMA = Symbol("form-schema");
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
export const FORM_ROOT_ID = Symbol("form-root-id");
export const FORM_FIELDS_STATE_MAP = Symbol("form-fields-state-map");

export function internalIdFromPath(idBuilder: FormIdBuilder, path: Path) {
  const pseudoElement = tryGetPseudoElement(path);
  return pseudoElement !== undefined
    ? idBuilder.pseudoId(idBuilder.fromPath(path.slice(0, -1)), pseudoElement)
    : idBuilder.fromPath(path);
}

export function internalGroupErrors(
  idBuilder: FormIdBuilder,
  errors: ValidationError[]
): FormErrorsMap {
  const map = new SvelteMap<Id, string[]>();
  for (const { path, message } of errors) {
    const id = internalIdFromPath(idBuilder, path);
    const arr = map.get(id);
    if (arr) {
      arr.push(message);
    } else {
      map.set(id, [message]);
    }
  }
  return map;
}
