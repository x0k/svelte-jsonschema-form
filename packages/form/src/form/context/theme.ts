import type { Config } from "../config.js";
import type { ComponentType, CompatibleDefinitions } from "../theme.js";

import type { FormContext } from "./context.js";

export function getComponent<T extends ComponentType, E>(
  ctx: FormContext<E>,
  type: T,
  config: Config
): CompatibleDefinitions[T] {
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
