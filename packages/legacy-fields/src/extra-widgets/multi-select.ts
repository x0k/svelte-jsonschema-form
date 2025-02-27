import type { SchemaArrayValue } from "@sjsf/form/core";

import type { Options, WidgetCommonProps } from "../widgets.js";

declare module "@sjsf/form" {
  interface ComponentProps {
    multiSelectWidget: WidgetCommonProps<SchemaArrayValue> & Options;
  }
  interface ComponentBindings {
    multiSelectWidget: "value";
  }
}
