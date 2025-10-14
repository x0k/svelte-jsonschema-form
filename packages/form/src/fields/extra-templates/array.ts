import type { Snippet } from "svelte";

import type { SchemaArrayValue } from "@/core/index.js";

import type { TemplateCommonProps } from "../templates.js";

declare module "../../form/index.js" {
  interface FoundationalComponents {
    arrayTemplate: {};
  }
  interface ComponentProps {
    arrayTemplate: TemplateCommonProps<SchemaArrayValue> & {
      addButton?: Snippet;
    };
  }
  interface ComponentBindings {
    arrayTemplate: "";
  }
}
