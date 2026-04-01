import type { SchemaArrayValue } from "@/core/index.js";

import type { MultiSelectOptions, WidgetCommonProps } from "../widgets.js";

declare module "../../form/index.js" {
  interface ComponentProps {
    multiSelectWidget: WidgetCommonProps<SchemaArrayValue> & MultiSelectOptions;
  }
  interface ComponentBindings {
    multiSelectWidget: "value";
  }
}
