import type { Config, UiOption } from "#form/index.js";

export function getTemplateProps(
  uiOption: UiOption,
  config: Config,
  description?: string
) {
  return {
    title: config.title,
    showMeta: uiOption("hideTitle") !== true,
    description:
      uiOption("description") ?? description ?? config.schema.description,
  };
}
