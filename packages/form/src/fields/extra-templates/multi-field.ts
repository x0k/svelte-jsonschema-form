import type { Snippet } from "svelte";

import type { SchemaValue } from "@/form/index.js";

import type { TemplateCommonProps } from "../templates.js";

declare module "../../form/index.js" {
  interface FoundationalComponents {
    multiFieldTemplate: {};
  }
  interface ComponentProps {
    multiFieldTemplate: TemplateCommonProps<SchemaValue> & {
      optionSelector: Snippet;
      action?: Snippet;
    };
  }

  interface ComponentBindings {
    multiFieldTemplate: "";
  }
}
