import type { Config } from '../config.js';
import { createMessage } from '../error-message.svelte';
import type { TemplateType, Template } from '../templates/model.js';

import type { FormContext } from './context.js';

function getTemplateInternal<T extends TemplateType>(
  ctx: FormContext,
  type: T,
  config: Config
): Template<T> | undefined {
  const template = config.uiSchema["ui:templates"]?.[type];
  switch (typeof template) {
    case "undefined":
      return ctx.templates(type, config);
    case "string":
      return ctx.templates(template as T, config);
    default:
      return template as Template<T>;
  }
}

export function getTemplate<T extends TemplateType>(
  ctx: FormContext,
  type: T,
  config: Config
): Template<T> {
  return (
    getTemplateInternal(ctx, type, config) ??
    (createMessage(
      `Template "${config.uiSchema["ui:templates"]?.[type] ?? type}" not found`
    ) as Template<T>)
  );
}
