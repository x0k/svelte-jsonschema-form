import type { Resolved } from "@/lib/resolver.js";

import type { Config } from "../config.js";
import type { CompatibleDefinitions, FoundationalComponent } from "../theme.js";
import type { FormValidator } from "../validator.js";

import type { FormContext } from "./context.js";

export function getComponent<
  T extends FoundationalComponent,
  VE,
  V extends FormValidator<VE>,
>(
  ctx: FormContext<VE, V>,
  type: T,
  config: Config
): Resolved<T, CompatibleDefinitions> {
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
      return component as Resolved<T, CompatibleDefinitions>;
  }
}
