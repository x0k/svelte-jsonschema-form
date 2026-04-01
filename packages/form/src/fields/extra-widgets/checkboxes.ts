import type { SchemaArrayValue } from "@/core/index.js";

import type { MultiSelectOptions, WidgetCommonProps } from "../widgets.js";

declare module "../../form/index.js" {
  interface ComponentProps {
    checkboxesWidget: WidgetCommonProps<SchemaArrayValue> & MultiSelectOptions;
  }
  interface ComponentBindings {
    checkboxesWidget: "value";
  }
}
