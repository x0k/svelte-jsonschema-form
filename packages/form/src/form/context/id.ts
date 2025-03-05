import type { Validator } from "@/core/index.js";

import {
  type Id,
  type IdentifiableFieldElement,
  computePseudoId,
  makeChildId,
  pathToId,
} from "../id.js";

import type { FormContext } from "./context.js";

export function createId<V extends Validator>(
  ctx: FormContext<V>,
  path: Array<string | number>
) {
  return pathToId(path, ctx);
}

export function createChildId<V extends Validator>(
  ctx: FormContext<V>,
  parentId: Id,
  child: string | number
): Id {
  return makeChildId(ctx.idSeparator, parentId, child);
}

export function createPseudoId<V extends Validator>(
  ctx: FormContext<V>,
  instanceId: Id,
  element: keyof IdentifiableFieldElement | number
) {
  return computePseudoId(ctx.idPseudoSeparator, instanceId, element);
}
