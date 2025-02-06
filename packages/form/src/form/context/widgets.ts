import type { Config } from "../config.js";
import { createMessage } from "../error-message.svelte";
import type { CompatibleWidgets, WidgetType } from "../widgets.js";

import type { FormContext } from "./context.js";

function getWidgetInternal<T extends WidgetType>(
  ctx: FormContext,
  type: T,
  config: Config
) {
  const widget = config.uiSchema["ui:widget"];
  switch (typeof widget) {
    case "undefined":
      return ctx.widget(type, config);
    case "string":
      return ctx.widget(widget as T, config);
    default:
      return widget as CompatibleWidgets[T];
  }
}

export function getWidget<T extends WidgetType>(
  ctx: FormContext,
  type: T,
  config: Config
): CompatibleWidgets[T] {
  return (
    getWidgetInternal(ctx, type, config) ??
    (createMessage(
      `Widget "${config.uiSchema["ui:widget"] ?? type}" not found`
    ) as CompatibleWidgets[T])
  );
}
