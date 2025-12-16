import type { Range } from "@/lib/range.js";

import type { WidgetCommonProps } from "../widgets.js";

declare module "../../form/index.js" {
  interface ComponentProps {
    numberRangeWidget: WidgetCommonProps<Partial<Range<number>>>;
  }
  interface ComponentBindings {
    numberRangeWidget: "value";
  }
}
