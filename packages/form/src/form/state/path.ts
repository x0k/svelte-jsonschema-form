import { untrack } from "svelte";

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
 * @command
 */
export function createId<T>(ctx: FormState<T>, path: FieldPath): Id {
  return untrack(() => ctx[FORM_ID_FROM_PATH](path));
}

/**
 * @command
 */
function createPath<T>(ctx: FormState<T>, path: RPath): FieldPath {
  return untrack(() =>
    internalRegisterFieldPath(ctx[FORM_PATHS_TRIE_REF], path)
  );
}

/**
 * @command
 */
export function createChildPath<T>(
  ctx: FormState<T>,
  parentPath: FieldPath,
  indexOrProperty: string | number
) {
  return createPath(ctx, parentPath.concat(indexOrProperty));
}

/**
 * @command
 */
export function createPseudoPath<T>(
  ctx: FormState<T>,
  parentPath: FieldPath,
  element: FieldPseudoElement
) {
  return createChildPath(ctx, parentPath, encodePseudoElement(element));
}

/**
 * @command
 */
export function createPseudoId<T>(
  ctx: FormState<T>,
  path: FieldPath,
  element: FieldPseudoElement
): Id {
  return createId(ctx, createPseudoPath(ctx, path, element));
}

/**
 * @command
 */
export function createIdByPath<T>(ctx: FormState<T>, path: RPath): Id {
  return createId(ctx, createPath(ctx, path));
}

/**
 * @command
 */
export function createPseudoIdByPath<T>(
  ctx: FormState<T>,
  path: RPath,
  element: FieldPseudoElement
): Id {
  return createIdByPath(ctx, path.concat(encodePseudoElement(element)));
}
