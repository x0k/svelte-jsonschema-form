import type { Config } from "../config.js";
import { createMessage } from "../error-message.svelte";
import type {
  Definitions,
  ComponentType,
  CompatibleDefinitions,
} from "../theme.js";

import type { FormContext } from "./context.js";

function getComponentInternal<T extends ComponentType>(
  ctx: FormContext,
  type: T,
  config: Config
): CompatibleDefinitions[T] | undefined {
  const component = config.uiSchema["ui:components"]?.[type];
  switch (typeof component) {
    case "undefined":
      return ctx.theme(type, config);
    case "string":
      // @ts-expect-error TODO
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
): CompatibleDefinitions[T] {
  return (
    getComponentInternal(ctx, type, config) ??
    (createMessage(`Component ${type} not found`) as Definitions[T])
  );
}
