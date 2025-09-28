import type { Path } from "@/core/index.js";

import type { FieldPseudoElement, Id } from "../id.js";
import { FORM_ID_BUILDER, internalIdFromPath } from "../internals.js";
import type { FormState } from "./state.js";

export function createPseudoId<T>(
  ctx: FormState<T>,
  instanceId: Id,
  elementOrIndex: FieldPseudoElement
) {
  return ctx[FORM_ID_BUILDER].pseudoId(instanceId, elementOrIndex);
}

export function idFromPath<T>(ctx: FormState<T>, path: Path) {
  return internalIdFromPath(ctx[FORM_ID_BUILDER], path);
}
