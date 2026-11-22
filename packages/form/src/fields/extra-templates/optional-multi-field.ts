import type { Snippet } from "svelte";

import type { SchemaValue } from "#form/index.js";

import type { TemplateCommonProps } from "../templates.js";

declare module "../../form/index.js" {
  interface FoundationalComponents {
    optionalMultiFieldTemplate: {};
  }
  interface ComponentProps {
    optionalMultiFieldTemplate: TemplateCommonProps<SchemaValue> & {
      optionSelector: Snippet;
      action?: Snippet;
      /**
       * Whether the template renders the field's title, description and
       * action. The combination field sets this to `false` when another field
       * renders the shared properties, so that field owns the meta instead.
       */
      showMeta: boolean;
    };
  }

  interface ComponentBindings {
    optionalMultiFieldTemplate: "";
  }
}
