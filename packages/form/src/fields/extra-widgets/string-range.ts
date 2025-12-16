import type { Range } from "@/lib/range.js";

import type { WidgetCommonProps } from "../widgets.js";

declare module "../../form/index.js" {
  interface ComponentProps {
    stringRangeWidget: WidgetCommonProps<Partial<Range<string>>>;
  }
  interface ComponentBindings {
    stringRangeWidget: "value";
  }
}
