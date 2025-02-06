import type { Components, ComponentType } from "../component.js";
import type { Config } from "../config.js";
import { createMessage } from "../error-message.svelte";

import type { FormContext } from "./context.js";

function getComponentInternal<T extends ComponentType>(
  ctx: FormContext,
  type: T,
  config: Config
) {
  const component = config.uiSchema["ui:components"]?.[type];
  switch (typeof component) {
    case "undefined":
      return ctx.component(type, config);
    case "string":
      return ctx.component(component as T, config);
    default:
      return component as Components[T];
  }
}

export function getComponent<T extends ComponentType>(
  ctx: FormContext,
  type: T,
  config: Config
): Components[T] {
  // @ts-expect-error TODO: improve `createMessage` type
  return (
    getComponentInternal(ctx, type, config) ??
    createMessage(
      `Component "${
        config.uiSchema["ui:components"]?.[type] ?? type
      }" not found`
    )
  );
}
