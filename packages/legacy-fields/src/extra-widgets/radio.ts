import type { SchemaValue } from "@sjsf/form";

import type { Options, WidgetCommonProps } from "../widgets.js";

declare module "@sjsf/form" {
  interface ComponentProps {
    radioWidget: WidgetCommonProps<SchemaValue> & Options;
  }
  interface ComponentBindings {
    radioWidget: "value";
  }
}
