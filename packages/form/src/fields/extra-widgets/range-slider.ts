import type { Range } from "@/lib/range.js";

import type { WidgetCommonProps } from "../widgets.js";

declare module "../../form/index.js" {
  interface ComponentProps {
    rangeSliderWidget: WidgetCommonProps<Partial<Range<number>>>;
  }
  interface ComponentBindings {
    rangeSliderWidget: "value";
  }
}
