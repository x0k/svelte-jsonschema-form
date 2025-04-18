import type { WidgetCommonProps } from "../widgets.js";

declare module "../../form/index.js" {
  interface ComponentProps {
    datePickerWidget: WidgetCommonProps<Date>;
  }
  interface ComponentBindings {
    datePickerWidget: "value";
  }
}
