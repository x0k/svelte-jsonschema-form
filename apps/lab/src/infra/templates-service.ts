import type { Resource } from "@/lib/resource.js";

import type { Template, TemplateMeta } from "@/domain/index.js";

export interface LoadableTemplate extends TemplateMeta {
  files: Promise<Template["files"]>;
}

export interface TemplatesServiceOptions {
  templates: LoadableTemplate[];
}

export function createTemplatesService({ templates }: TemplatesServiceOptions) {
  return {
    allTemplatesMeta: {
      status: "success",
      value: templates,
    } satisfies Resource<TemplateMeta[]>,
  };
}
