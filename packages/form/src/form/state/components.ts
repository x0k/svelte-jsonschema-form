import type { Resolved } from "@/lib/resolver.js";
import type { Validator } from "@/core/index.js";

import type { Config } from "../config.js";
import type {
  CompatibleComponentDefinitions,
  FoundationalComponentType,
} from "../components.js";
import { createMessage } from "../error-message.svelte";
import { FORM_RESOLVER, FORM_THEME, FORM_TRANSLATE } from "../internals.js";
import type { FormState } from "./state.js";

export function getComponent<
  FT,
  V extends Validator,
  T extends FoundationalComponentType,
>(
  ctx: FormState<FT, V>,
  type: T,
  config: Config
): Resolved<T, CompatibleComponentDefinitions> {
  const component = config.uiSchema["ui:components"]?.[type];
  switch (typeof component) {
    case "undefined":
      return (ctx[FORM_THEME](type, config) ??
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        createMessage(
          ctx[FORM_TRANSLATE]("component-not-found", { type })
        )) as Resolved<T, CompatibleComponentDefinitions>;
    case "string":
      return (ctx[FORM_THEME](component as T, config) ??
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        createMessage(
          ctx[FORM_TRANSLATE]("component-not-found", {
            // @ts-expect-error ts cannot infer type properly by some reason
            type: component as string,
          })
        )) as Resolved<T, CompatibleComponentDefinitions>;
    default:
      return component as Resolved<T, CompatibleComponentDefinitions>;
  }
}

export function getFieldComponent<T, V extends Validator>(
  ctx: FormState<T, V>,
  config: Config
) {
  return getComponent(ctx, ctx[FORM_RESOLVER](config), config);
}
