import type { Snippet } from "svelte";

import type { SchemaValue } from "@/form/index.js";

import type { TemplateCommonProps } from "../templates.js";

declare module "../../form/index.js" {
  interface FoundationalComponents {
    optionalMultiFieldTemplate: {};
  }
  interface ComponentProps {
    optionalMultiFieldTemplate: TemplateCommonProps<SchemaValue> & {
      optionSelector: Snippet;
      action?: Snippet;
    };
  }

  interface ComponentBindings {
    optionalMultiFieldTemplate: "";
  }
}

