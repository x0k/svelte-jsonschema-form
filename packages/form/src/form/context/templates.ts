import type { Config } from "../config.js";
import { createMessage } from "../error-message.svelte";
import type { TemplateType, Templates } from "../templates.js";

import type { FormContext } from "./context.js";

function getTemplateInternal<T extends TemplateType>(
  ctx: FormContext,
  type: T,
  config: Config
) {
  const template = config.uiSchema["ui:templates"]?.[type];
  switch (typeof template) {
    case "undefined":
      return ctx.template(type, config);
    case "string":
      return ctx.template(template as T, config);
    default:
      return template as Templates[T];
  }
}

export function getTemplate<T extends TemplateType>(
  ctx: FormContext,
  type: T,
  config: Config
): Templates[T] {
  return (
    getTemplateInternal(ctx, type, config) ??
    (createMessage(
      `Template "${config.uiSchema["ui:templates"]?.[type] ?? type}" not found`
    ) as Templates[T])
  );
}
