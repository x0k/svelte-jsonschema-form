import type { Config } from "../config.js";
import { createMessage } from "../error-message.svelte";
import type { Components, ComponentType } from "../theme.js";

import type { FormContext } from "./context.js";

function getComponentInternal<T extends ComponentType>(
  ctx: FormContext,
  type: T,
  config: Config
): Components[T] | undefined {
  const component = config.uiSchema["ui:components"]?.[type];
  switch (typeof component) {
    case "undefined":
      return ctx.theme(type, config);
    case "string":
      return ctx.theme(component as T, config);
    default:
      return component;
  }
}

export function getComponent<T extends ComponentType>(
  ctx: FormContext,
  type: T,
  config: Config
) {
  return (
    getComponentInternal(ctx, type, config) ??
    (createMessage(`Component ${type} not found`) as Components[T])
  );
}
