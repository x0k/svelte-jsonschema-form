import type { ActionField, FieldAction } from "../actions.js";
import type { ComponentProps } from "../components.js";
import type { Config } from "../config.js";
import { FORM_FIELD_ACTIONS } from "../internals.js";

import type { FormState } from "./state.js";

/**
 * @query
 */
export function getFieldAction<FT, T extends ActionField>(
  ctx: FormState<FT>,
  field: T,
  config: Config
): FieldAction<ComponentProps[T]["value"]> | undefined {
  const action = config.uiSchema["ui:actions"]?.[field];
  switch (typeof action) {
    case "string":
      return ctx[FORM_FIELD_ACTIONS]?.(action, config) as
        | FieldAction<ComponentProps[T]["value"]>
        | undefined;
    default:
      return action;
  }
}
