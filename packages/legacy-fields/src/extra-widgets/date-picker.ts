import type { WidgetCommonProps } from "../widgets.js";

declare module "@sjsf/form" {
  interface ComponentProps {
    datePickerWidget: WidgetCommonProps<string>;
  }
  interface ComponentBindings {
    datePickerWidget: "value";
  }
}
