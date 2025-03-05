import {
  type Id,
  type IdentifiableFieldElement,
  computePseudoId,
  makeChildId,
  pathToId,
} from "../id.js";
import type { FormValidator } from "../validator.js";

import type { FormContext } from "./context.js";

export function createId<VE, V extends FormValidator<VE>>(
  ctx: FormContext<VE, V>,
  path: Array<string | number>
) {
  return pathToId(path, ctx);
}

export function createChildId<VE, V extends FormValidator<VE>>(
  ctx: FormContext<VE, V>,
  parentId: Id,
  child: string | number
): Id {
  return makeChildId(ctx.idSeparator, parentId, child);
}

export function createPseudoId<VE, V extends FormValidator<VE>>(
  ctx: FormContext<VE, V>,
  instanceId: Id,
  element: keyof IdentifiableFieldElement | number
) {
  return computePseudoId(ctx.idPseudoSeparator, instanceId, element);
}
