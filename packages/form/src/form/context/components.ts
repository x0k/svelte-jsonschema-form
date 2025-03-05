import type { Resolved } from "@/lib/resolver.js";
import type { Validator } from "@/core/index.js";

import type { Config } from "../config.js";
import type {
  CompatibleComponentDefinitions,
  FoundationalComponent,
} from "../components.js";
import { createMessage } from "../error-message.svelte";

import type { FormContext } from "./context.js";
import { translate } from "./translation.js";

function getComponentInner<
  T extends FoundationalComponent,
  V extends Validator,
>(ctx: FormContext<V>, type: T, config: Config) {
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
  T extends FoundationalComponent,
  V extends Validator,
>(
  ctx: FormContext<V>,
  type: T,
  config: Config
): Resolved<T, CompatibleComponentDefinitions> {
  //@ts-expect-error
  return (
    getComponentInner(ctx, type, config) ??
    createMessage(translate(ctx, "component-not-found", { type }))
  );
}
