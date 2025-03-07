import type { WidgetCommonProps } from "../widgets.js";

declare module "../../form/index.js" {
  interface ComponentProps {
    datePickerWidget: WidgetCommonProps<string>;
  }
  interface ComponentBindings {
    datePickerWidget: "value";
  }
}
