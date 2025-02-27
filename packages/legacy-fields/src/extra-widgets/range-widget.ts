import type { WidgetCommonProps } from "../widgets.js";

declare module "@sjsf/form" {
  interface ComponentProps {
    rangeWidget: WidgetCommonProps<number>;
  }
  interface ComponentBindings {
    rangeWidget: "value";
  }
}
