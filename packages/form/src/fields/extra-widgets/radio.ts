import type { SchemaValue } from "@/form/index.js";

import type { SingleSelectOptions, WidgetCommonProps } from "../widgets.js";

declare module "../../form/index.js" {
  interface ComponentProps {
    radioWidget: WidgetCommonProps<SchemaValue> & SingleSelectOptions;
  }
  interface ComponentBindings {
    radioWidget: "value";
  }
}
