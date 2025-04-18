import type { WidgetCommonProps } from "../widgets.js";

declare module "../../form/index.js" {
  interface ComponentProps {
    dateTimePickerWidget: WidgetCommonProps<Date>;
  }
  interface ComponentBindings {
    dateTimePickerWidget: "value";
  }
}

