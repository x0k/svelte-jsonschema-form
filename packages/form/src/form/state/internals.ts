import type { RPath } from "#core/index.js";

import type { FieldPath } from "../id.js";
import {
  FORM_PATHS_TRIE_REF,
  internalRegisterFieldPath,
} from "../internals.js";
import type { FormState } from "./state.js";

/**
 * Returns the cached `FieldPath` for `path`. When `path` is already a
 * registered `FieldPath`, it is returned as-is without a lookup.
 */
export function getFieldPath<T>(ctx: FormState<T>, path: RPath): FieldPath {
  return internalRegisterFieldPath(ctx[FORM_PATHS_TRIE_REF], path);
}
