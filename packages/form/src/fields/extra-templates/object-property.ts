import type { Snippet } from "svelte";

import type { SchemaValue } from "@/form/index.js";

import type { TemplateCommonProps } from "../templates.js";

declare module "../../form/index.js" {
  interface FoundationalComponents {
    objectPropertyTemplate: {};
  }
  interface ComponentProps {
    objectPropertyTemplate: TemplateCommonProps<SchemaValue> & {
      property: string;
      keyInput?: Snippet;
      removeButton?: Snippet;
    };
  }
  interface ComponentBindings {
    objectPropertyTemplate: "";
  }
}
