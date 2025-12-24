import type { WidgetCommonProps } from "../widgets.js";

declare module "../../form/index.js" {
  interface ComponentProps {
    calendarWidget: WidgetCommonProps<string>;
  }
  interface ComponentBindings {
    calendarWidget: "value";
  }
}
