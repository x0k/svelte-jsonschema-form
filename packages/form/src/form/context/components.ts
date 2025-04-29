import type { Resolved } from "@/lib/resolver.js";
import type { Validator } from "@/core/index.js";

import type { Config } from "../config.js";
import {
  castComponent,
  type CompatibleComponentDefinitions,
  type FoundationalComponentType,
} from "../components.js";
import { createMessage } from "../error-message.svelte";
import { resolveUiOptionValue } from "../ui-schema.js";

import type { FormInternalContext } from "./context.js";
import { translate } from "./translation.js";

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
    case "object":
      const cmp =
        typeof component.component === "string"
          ? ctx.theme(component.component, config)
          : component.component;
      return castComponent(
        // @ts-expect-error
        cmp,
        resolveUiOptionValue(ctx.uiOptionsRegistry, component.properties)
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
    createMessage(translate(ctx, "component-not-found", { type }))
  );
}

export function getFieldComponent<V extends Validator>(
  ctx: FormInternalContext<V>,
  config: Config
) {
  return getComponent(ctx, ctx.fieldTypeResolver(config), config);
}
