import type { RPath } from "#core/index.js";
import { getNodeByKeys, type Node } from "#lib/trie.js";

import {
  encodePseudoElement,
  type FieldPath,
  type FieldPseudoElement,
  type Id,
} from "../id.js";
import { FORM_ID_FROM_PATH, FORM_PATHS_TRIE_REF } from "../internals.js";
import { getFieldPath } from "./internals.js";
import type { FormState } from "./state.js";

/**
 * Returns the id for `path`. Accepts a plain `RPath` or an already registered
 * `FieldPath`; the latter skips the path lookup.
 *
 * @query
 */
export function getId<T>(ctx: FormState<T>, path: RPath): Id {
  return ctx[FORM_ID_FROM_PATH](getFieldPath(ctx, path));
}

/**
 * @query
 */
function* emitNodeValues(
  node: Node<RPath[number], FieldPath>
): Generator<FieldPath> {
  if (node.value !== undefined) {
    yield node.value;
  }
  for (const n of node.values.values()) {
    yield* emitNodeValues(n);
  }
}

/**
 * WARN: This method will not react to changes in the subtree.
 * @query
 */
export function* getSubtreePaths<T>(ctx: FormState<T>, path: RPath) {
  const trie = ctx[FORM_PATHS_TRIE_REF].current;
  const node = getNodeByKeys(trie, path);
  if (node === undefined) {
    return;
  }
  yield* emitNodeValues(node);
}

/**
 * @query
 */
export function getChildPath<T>(
  ctx: FormState<T>,
  parentPath: RPath,
  indexOrProperty: string | number
) {
  return getFieldPath(ctx, parentPath.concat(indexOrProperty));
}

/**
 * @query
 */
export function getPseudoPath<T>(
  ctx: FormState<T>,
  parentPath: RPath,
  element: FieldPseudoElement
) {
  return getChildPath(ctx, parentPath, encodePseudoElement(element));
}

/**
 * @query
 */
export function getPseudoId<T>(
  ctx: FormState<T>,
  path: RPath,
  element: FieldPseudoElement
): Id {
  return getId(ctx, getPseudoPath(ctx, path, element));
}
