import type { Snippet } from "svelte";

import type { SchemaObjectValue } from "@/core/index.js";

import type { TemplateCommonProps } from "../templates.js";

declare module "../../form/index.js" {
  interface FoundationalComponents {
    optionalObjectTemplate: {};
  }
  interface ComponentProps {
    optionalObjectTemplate: TemplateCommonProps<SchemaObjectValue> & {
      addButton?: Snippet;
      action?: Snippet;
    };
  }
  interface ComponentBindings {
    optionalObjectTemplate: "";
  }
}
