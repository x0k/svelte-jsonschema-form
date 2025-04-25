import type { Config, UiOption } from "@/form/index.js";

export function getTemplateProps(uiOption: UiOption, config: Config) {
  return {
    title: config.title,
    showMeta: uiOption("hideTitle") !== true,
    description: uiOption("description") ?? config.schema.description,
  };
}
