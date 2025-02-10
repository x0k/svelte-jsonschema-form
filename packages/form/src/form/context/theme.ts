import type { Config } from "../config.js";
import { createMessage } from "../error-message.svelte";
import type { Definitions, ComponentType } from "../theme.js";

import type { FormContext } from "./context.js";

function getComponentInternal<T extends ComponentType>(
  ctx: FormContext,
  type: T,
  config: Config
): Definitions[T] | undefined {
  const component = config.uiSchema["ui:components"]?.[type];
  switch (typeof component) {
    case "undefined":
      return ctx.theme(type, config);
    case "string":
      return ctx.theme(component as T, config);
    default:
      // @ts-expect-error TODO
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
    (createMessage(`Component ${type} not found`) as Definitions[T])
  );
}
