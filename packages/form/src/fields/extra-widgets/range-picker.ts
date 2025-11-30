import type { Range } from "@/lib/range.js";
import type { SchemaValue } from "@/core/schema.js";

import type { WidgetCommonProps } from "../widgets.js";

declare module "../../form/index.js" {
  interface ComponentProps {
    rangePickerWidget: WidgetCommonProps<Range<SchemaValue | undefined>>;
  }
  interface ComponentBindings {
    rangePickerWidget: "value";
  }
}
