import type { Config } from '../config.js';
import { createMessage } from '../error-message.svelte';
import type { CompatibleWidgetType, Widget, WidgetType } from '../widgets.js';

import type { FormContext } from './context.js';

function getWidgetInternal<T extends WidgetType>(
  ctx: FormContext,
  type: T,
  config: Config
): Widget<CompatibleWidgetType<T>> | undefined {
  const widget = config.uiSchema["ui:widget"];
  switch (typeof widget) {
    case "undefined":
      return ctx.widgets(type, config);
    case "string":
      return ctx.widgets(widget as T, config);
    default:
      return widget as Widget<CompatibleWidgetType<T>>;
  }
}

export function getWidget<T extends WidgetType>(
  ctx: FormContext,
  type: T,
  config: Config
): Widget<CompatibleWidgetType<T>> {
  return (
    getWidgetInternal(ctx, type, config) ??
    (createMessage(
      `Widget "${config.uiSchema["ui:widget"] ?? type}" not found`
    ) as Widget<CompatibleWidgetType<T>>)
  );
}
