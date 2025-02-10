import {
  type Id,
  type IdentifiableFieldElement,
  computePseudoId,
  pathToId,
} from "../id.js";

import type { FormContext } from "./context.js";

export function makePseudoId(
  ctx: FormContext,
  instanceId: Id,
  element: keyof IdentifiableFieldElement | number
) {
  return computePseudoId(ctx.idPseudoSeparator, instanceId, element);
}

export function createId(ctx: FormContext, path: Array<string | number>) {
  return pathToId(ctx.idPrefix, ctx.idSeparator, path);
}

export function makeArrayItemId(ctx: FormContext, parentId: Id, index: number) {
  return `${parentId}${ctx.idSeparator}${index}`;
}

export function makeObjectPropertyId(
  ctx: FormContext,
  parentId: Id,
  property: string
) {
  return `${parentId}${ctx.idSeparator}${property}`;
}
