import { getNodeByKeys, insertValue } from "@/lib/trie.js";
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

export function createId<T>(ctx: FormState<T>, path: FieldPath): Id {
  return ctx[FORM_ID_FROM_PATH](path);
}

export function createIdByPath<T>(ctx: FormState<T>, path: RPath): Id {
  return createId(
    ctx,
    internalRegisterFieldPath(ctx[FORM_PATHS_TRIE_REF], path)
  );
}

export function createChildPath<T>(
  ctx: FormState<T>,
  parentPath: FieldPath,
  indexOrProperty: string | number
) {
  const ref = ctx[FORM_PATHS_TRIE_REF];
  const path = parentPath.concat(indexOrProperty) as unknown as FieldPath;
  const node = getNodeByKeys(ref.current, path);
  if (node !== undefined) {
    const v = node.value;
    if (v !== undefined) {
      return v;
    }
    node.value = path;
  } else {
    ref.current = insertValue(ref.current, path, path);
  }
  return path;
}

export function createPseudoPath<T>(
  ctx: FormState<T>,
  parentPath: FieldPath,
  element: FieldPseudoElement
) {
  return createChildPath(ctx, parentPath, encodePseudoElement(element));
}

export function createPseudoId<T>(
  ctx: FormState<T>,
  path: FieldPath,
  element: FieldPseudoElement
): Id {
  return createId(ctx, createPseudoPath(ctx, path, element));
}

export function createPseudoIdByPath<T>(
  ctx: FormState<T>,
  path: RPath,
  element: FieldPseudoElement
): Id {
  return createPseudoIdByPath(
    ctx,
    internalRegisterFieldPath(ctx[FORM_PATHS_TRIE_REF], path),
    element
  );
}

