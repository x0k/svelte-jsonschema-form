import type { Snippet } from "svelte";

import type { SchemaValue } from "@/core/index.js";
import type { FoundationalComponentType } from '@/form/index.js';

import type { TemplateCommonProps } from "../templates.js";

declare module "../../form/index.js" {
  interface FoundationalComponents {
    optionalFieldTemplate: {};
  }
  interface ComponentProps {
    optionalFieldTemplate: TemplateCommonProps<SchemaValue> & {
      showTitle: boolean;
      useLabel: boolean;
      widgetType: FoundationalComponentType;
      action?: Snippet;
    };
  }
  interface ComponentBindings {
    optionalFieldTemplate: "";
  }
}

