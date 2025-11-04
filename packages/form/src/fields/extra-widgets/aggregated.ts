import type { SchemaObjectValue } from "@/core/schema.js";

import type { WidgetCommonProps } from "../widgets.js";

declare module "../../form/index.js" {
  interface ComponentProps {
    aggregatedWidget: WidgetCommonProps<SchemaObjectValue>;
  }
  interface ComponentBindings {
    aggregatedWidget: "value";
  }
}
