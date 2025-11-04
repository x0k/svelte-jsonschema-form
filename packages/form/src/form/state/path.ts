import type { RPath } from "@/core/index.js";

import {
  encodePseudoElement,
  type FieldPath,
  type FieldPseudoElement,
  type Id,
} from "../id.js";
import {
  FORM_ID_FROM_PATH,
  FORM_PATHS_TRIE_REF,
  internalRegisterFieldPath,
} from "../internals.js";

import type { FormState } from "./state.js";

/**
 * @query
 */
export function getId<T>(ctx: FormState<T>, path: FieldPath): Id {
  return ctx[FORM_ID_FROM_PATH](path);
}

/**
 * @query
 */
function getFieldPath<T>(ctx: FormState<T>, path: RPath): FieldPath {
  return internalRegisterFieldPath(ctx[FORM_PATHS_TRIE_REF], path)
}

/**
 * @query
 */
export function getChildPath<T>(
  ctx: FormState<T>,
  parentPath: FieldPath,
  indexOrProperty: string | number
) {
  return getFieldPath(ctx, parentPath.concat(indexOrProperty));
}

/**
 * @query
 */
export function getPseudoPath<T>(
  ctx: FormState<T>,
  parentPath: FieldPath,
  element: FieldPseudoElement
) {
  return getChildPath(ctx, parentPath, encodePseudoElement(element));
}

/**
 * @query
 */
export function getPseudoId<T>(
  ctx: FormState<T>,
  path: FieldPath,
  element: FieldPseudoElement
): Id {
  return getId(ctx, getPseudoPath(ctx, path, element));
}

/**
 * @query
 */
export function getIdByPath<T>(ctx: FormState<T>, path: RPath): Id {
  return getId(ctx, getFieldPath(ctx, path));
}

/**
 * @query
 */
export function getPseudoIdByPath<T>(
  ctx: FormState<T>,
  path: RPath,
  element: FieldPseudoElement
): Id {
  return getIdByPath(ctx, path.concat(encodePseudoElement(element)));
}
