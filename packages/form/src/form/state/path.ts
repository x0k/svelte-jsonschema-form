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
export function createId<I, O>(ctx: FormState<I, O>, path: FieldPath): Id {
  return ctx[FORM_ID_FROM_PATH](path);
}

/**
 * @query
 */
function createPath<I, O>(ctx: FormState<I, O>, path: RPath): FieldPath {
  return internalRegisterFieldPath(ctx[FORM_PATHS_TRIE_REF], path);
}

/**
 * @query
 */
export function createChildPath<I, O>(
  ctx: FormState<I, O>,
  parentPath: FieldPath,
  indexOrProperty: string | number
) {
  return createPath(ctx, parentPath.concat(indexOrProperty));
}

/**
 * @query
 */
export function createPseudoPath<I, O>(
  ctx: FormState<I, O>,
  parentPath: FieldPath,
  element: FieldPseudoElement
) {
  return createChildPath(ctx, parentPath, encodePseudoElement(element));
}

/**
 * @query
 */
export function createPseudoId<I, O>(
  ctx: FormState<I, O>,
  path: FieldPath,
  element: FieldPseudoElement
): Id {
  return createId(ctx, createPseudoPath(ctx, path, element));
}

/**
 * @query
 */
export function createIdByPath<I, O>(ctx: FormState<I, O>, path: RPath): Id {
  return createId(ctx, createPath(ctx, path));
}

/**
 * @query
 */
export function createPseudoIdByPath<I, O>(
  ctx: FormState<I, O>,
  path: RPath,
  element: FieldPseudoElement
): Id {
  return createIdByPath(ctx, path.concat(encodePseudoElement(element)));
}
