import type { Config } from "../config";

export function getTemplateProps({ name, uiOptions, schema }: Config) {
  return {
    title: uiOptions?.title ?? schema.title ?? name,
    showMeta: uiOptions?.hideTitle !== true,
    description: uiOptions?.description ?? schema.description,
  };
}
