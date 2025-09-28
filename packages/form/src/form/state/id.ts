import type { Path } from "@/core/index.js";

import {
  tryGetPseudoElement,
  type FieldPseudoElement,
  type Id,
} from "../id.js";
import { FORM_ID_BUILDER } from "../internals.js";
import type { FormState } from "./state.js";

export function createPseudoId<T>(
  ctx: FormState<T>,
  instanceId: Id,
  elementOrIndex: FieldPseudoElement
) {
  return ctx[FORM_ID_BUILDER].pseudoId(instanceId, elementOrIndex);
}

export function idFromPath<T>(ctx: FormState<T>, path: Path) {
  const pseudoElement = tryGetPseudoElement(path);
  const b = ctx[FORM_ID_BUILDER];
  return pseudoElement !== undefined
    ? b.pseudoId(b.fromPath(path.slice(0, -1)), pseudoElement)
    : b.fromPath(path);
}
