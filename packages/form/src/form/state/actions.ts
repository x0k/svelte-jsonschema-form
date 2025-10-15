import type { FieldAction } from "../actions.js";
import type { Config } from "../config.js";
import { FORM_FIELD_ACTIONS } from "../internals.js";

import type { FormState } from "./state.js";
import { retrieveUiOption } from "./ui-schema.js";

/**
 * @query
 */
export function getFieldAction<FT>(
  ctx: FormState<FT>,
  config: Config
): FieldAction | undefined {
  const type = retrieveUiOption(ctx, config, "fieldAction");
  return type && ctx[FORM_FIELD_ACTIONS]?.(type, config);
}
