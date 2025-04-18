import type { SchemaValue } from "@/form/index.js";

import type { Options, WidgetCommonProps } from "../widgets.js";

declare module "../../form/index.js" {
  interface ComponentProps {
    radioWidget: WidgetCommonProps<SchemaValue> & Options;
  }
  interface ComponentBindings {
    radioWidget: "value";
  }
}
