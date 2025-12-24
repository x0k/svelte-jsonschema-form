import type { WidgetCommonProps } from "../widgets.js";

declare module "../../form/index.js" {
  interface ComponentProps {
    colorPickerWidget: WidgetCommonProps<string>;
  }
  interface ComponentBindings {
    colorPickerWidget: "value";
  }
}
