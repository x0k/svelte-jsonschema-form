import type { SchemaArrayValue } from "@/core/index.js";

import type { Options, WidgetCommonProps } from "../widgets.js";

declare module "../../form/index.js" {
  interface ComponentProps {
    multiSelectWidget: WidgetCommonProps<SchemaArrayValue> & Options;
  }
  interface ComponentBindings {
    multiSelectWidget: "value";
  }
}
