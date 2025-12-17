import type { Range } from "@/lib/range.js";

import type { WidgetCommonProps } from "../widgets.js";

declare module "../../form/index.js" {
  interface ComponentProps {
    dateRangePickerWidget: WidgetCommonProps<Partial<Range<string>>>;
  }
  interface ComponentBindings {
    dateRangePickerWidget: "value";
  }
}
