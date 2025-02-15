import {
  type Id,
  type IdentifiableFieldElement,
  computePseudoId,
  makeChildId,
  pathToId,
} from "../id.js";

import type { FormContext } from "./context.js";

export function createId<E>(ctx: FormContext<E>, path: Array<string | number>) {
  return pathToId(ctx.idPrefix, ctx.idSeparator, path);
}

export function createChildId<E>(
  ctx: FormContext<E>,
  parentId: Id,
  child: string | number
): Id {
  return makeChildId(ctx.idSeparator, parentId, child);
}

export function createPseudoId<E>(
  ctx: FormContext<E>,
  instanceId: Id,
  element: keyof IdentifiableFieldElement | number
) {
  return computePseudoId(ctx.idPseudoSeparator, instanceId, element);
}
