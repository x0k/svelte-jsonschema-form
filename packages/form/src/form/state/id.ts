import type { Path } from "@/core/index.js";

import { FORM_ID_BUILDER } from "../internals.js";
import type { Id } from "../id.js";
import type { FormState } from "./state.js";

export function idFromPath<T>(ctx: FormState<T>, path: Path) {
  return ctx[FORM_ID_BUILDER].fromPath(path);
}

export function pathFormId<T>(ctx: FormState<T>, id: Id) {
  return ctx[FORM_ID_BUILDER].toPath(id);
}
