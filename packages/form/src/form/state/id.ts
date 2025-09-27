import type { Path, Validator } from "@/core/index.js";

import {
  tryGetPseudoElement,
  type FieldPseudoElement,
  type Id,
} from "../id.js";
import { FORM_ID_BUILDER } from "../internals.js";
import type { FormState } from "./state.js";

export function createPseudoId<T, V extends Validator>(
  ctx: FormState<T, V>,
  instanceId: Id,
  elementOrIndex: FieldPseudoElement
) {
  return ctx[FORM_ID_BUILDER].pseudoId(instanceId, elementOrIndex);
}

export function createPropertyId<T, V extends Validator>(
  ctx: FormState<T, V>,
  instanceId: Id,
  property: string
) {
  return ctx[FORM_ID_BUILDER].propertyId(instanceId, property);
}

export function createItemId<T, V extends Validator>(
  ctx: FormState<T, V>,
  instanceId: Id,
  index: number
) {
  return ctx[FORM_ID_BUILDER].itemId(instanceId, index);
}

export function idFromPath<T, V extends Validator>(
  ctx: FormState<T, V>,
  path: Path
) {
  const pseudoElement = tryGetPseudoElement(path);
  const b = ctx[FORM_ID_BUILDER];
  return pseudoElement !== undefined
    ? b.pseudoId(b.fromPath(path.slice(0, -1)), pseudoElement)
    : b.fromPath(path);
}
