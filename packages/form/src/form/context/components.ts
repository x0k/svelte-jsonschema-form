import type { Resolved } from "@/lib/resolver.js";
import type { Validator } from "@/core/index.js";

import type { Config } from "../config.js";
import type {
  CompatibleComponentDefinitions,
  FoundationalComponentType,
} from "../components.js";
import { createMessage } from "../error-message.svelte";

import type { FormInternalContext } from "./context.js";

export function getComponent<
  T extends FoundationalComponentType,
  V extends Validator,
>(
  ctx: FormInternalContext<V>,
  type: T,
  config: Config
): Resolved<T, CompatibleComponentDefinitions> {
  const component = config.uiSchema["ui:components"]?.[type];
  switch (typeof component) {
    case "undefined":
      return (ctx.theme(type, config) ??
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        createMessage(
          ctx.translate("component-not-found", { type })
        )) as Resolved<T, CompatibleComponentDefinitions>;
    case "string":
      return (ctx.theme(component as T, config) ??
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        createMessage(
          ctx.translate("component-not-found", {
            // @ts-expect-error ts cannot infer type properly by some reason
            type: component as string,
          })
        )) as Resolved<T, CompatibleComponentDefinitions>;
    default:
      return component as Resolved<T, CompatibleComponentDefinitions>;
  }
}

export function getFieldComponent<V extends Validator>(
  ctx: FormInternalContext<V>,
  config: Config
) {
  return getComponent(ctx, ctx.fieldTypeResolver(config), config);
}
