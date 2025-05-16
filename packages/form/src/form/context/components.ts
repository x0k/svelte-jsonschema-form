import type { Resolved } from "@/lib/resolver.js";
import type { Validator } from "@/core/index.js";

import type { Config } from "../config.js";
import type {
  CompatibleComponentDefinitions,
  FoundationalComponentType,
} from "../components.js";
import { createMessage } from "../error-message.svelte";

import type { FormInternalContext } from "./context.js";

function getComponentInner<
  T extends FoundationalComponentType,
  V extends Validator
>(ctx: FormInternalContext<V>, type: T, config: Config) {
  const component = config.uiSchema["ui:components"]?.[type];
  switch (typeof component) {
    case "undefined":
      return ctx.theme(type, config);
    case "string":
      return ctx.theme(
        // @ts-expect-error TODO
        component as T,
        config
      );
    default:
      return component;
  }
}

export function getComponent<
  T extends FoundationalComponentType,
  V extends Validator
>(
  ctx: FormInternalContext<V>,
  type: T,
  config: Config
): Resolved<T, CompatibleComponentDefinitions> {
  //@ts-expect-error
  return (
    getComponentInner(ctx, type, config) ??
    createMessage(ctx.translate("component-not-found", { type }))
  );
}

export function getFieldComponent<V extends Validator>(
  ctx: FormInternalContext<V>,
  config: Config
) {
  return getComponent(ctx, ctx.fieldTypeResolver(config), config);
}
