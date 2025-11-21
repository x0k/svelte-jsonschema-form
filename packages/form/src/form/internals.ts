import { SvelteMap } from "svelte/reactivity";

import { getNodeByKeys, insertValue } from "@/lib/trie.js";
import type { RPath } from "@/core/index.js";

import type { ValidationError } from "./validator.js";
import type { PathTrieRef, Update } from "./model.js";
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

export function internalHasFieldState(
  map: SvelteMap<FieldPath, FieldState>,
  path: FieldPath,
  state: FieldState
) {
  return ((map.get(path) ?? 0) & state) > 0;
}

/**
This class must maintain two invariants:
- Field errors list should contain at leas one error
- Errors in the field errors list must be unique
**/
export class FormErrors {
  #map = new SvelteMap<
    FieldPath,
    {
      set: Set<string>;
      array: string[];
    }
  >();

  constructor(private readonly ref: PathTrieRef<FieldPath>) {}

  assign(entries: Iterable<readonly [FieldPath, string[]]>) {
    this.#map.clear();
    for (const entry of entries) {
      let array = entry[1];
      const set = new Set(array);
      if (array.length > set.size) {
        array = Array.from(set);
      }
      this.#map.set(entry[0], {
        set,
        array,
      });
    }
    return this;
  }

  updateErrors(errors: ReadonlyArray<ValidationError>): this {
    this.#map.clear();
    for (const { path, message } of errors) {
      const p = internalRegisterFieldPath(this.ref, path);
      const field = this.#map.get(p);
      if (field) {
        const l = field.set.size;
        field.set.add(message);
        if (l < field.set.size) {
          field.array.push(message);
        }
      } else {
        const array = [message];
        this.#map.set(p, {
          set: new Set(array),
          array,
        });
      }
    }
    return this;
  }

  getFieldErrors(path: FieldPath): ReadonlyArray<string> | undefined {
    return this.#map.get(path)?.array;
  }

  updateFieldErrors(path: FieldPath, errors: Update<string[]>) {
    if (typeof errors === "function") {
      const arr = this.#map.get(path)?.array ?? [];
      errors = errors(arr);
    }
    if (errors.length > 0) {
      const set = new Set(errors);
      this.#map.set(path, {
        set,
        array: Array.from(set),
      });
    } else {
      this.#map.delete(path);
    }
    return errors.length === 0;
  }

  hasErrors() {
    return this.#map.size > 0;
  }

  clear() {
    this.#map.clear()
  }

  *[Symbol.iterator]() {
    const casted: [FieldPath, string[]] = [[] as RPath as FieldPath, []];
    for (const pair of this.#map) {
      casted[0] = pair[0];
      casted[1] = pair[1].array;
      yield casted;
    }
  }
}
