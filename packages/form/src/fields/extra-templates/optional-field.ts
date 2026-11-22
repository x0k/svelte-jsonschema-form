import type { Snippet } from "svelte";

import type { SchemaValue } from "#core/index.js";
import type { FoundationalComponentType } from "#form/index.js";

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
      /**
       * Fallback description used when `ui:options.description` is not set.
       * Takes precedence over the schema description.
       */
      description?: string;
    };
  }
  interface ComponentBindings {
    optionalFieldTemplate: "";
  }
}
