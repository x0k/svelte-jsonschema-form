import type { SchemaValue } from "@/core/index.js";

import type { Options, WidgetCommonProps } from "../widgets.js";

declare module "../../form/index.js" {
  interface ComponentProps {
    comboboxWidget: WidgetCommonProps<SchemaValue> & Options;
  }
  interface ComponentBindings {
    comboboxWidget: "value";
  }
}
