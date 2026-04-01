import type { SchemaValue } from "@/core/index.js";

import type { SingleSelectOptions, WidgetCommonProps } from "../widgets.js";

declare module "../../form/index.js" {
  interface ComponentProps {
    comboboxWidget: WidgetCommonProps<SchemaValue> & SingleSelectOptions;
  }
  interface ComponentBindings {
    comboboxWidget: "value";
  }
}
