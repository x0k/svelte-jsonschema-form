import type { WidgetCommonProps } from "../widgets.js";

declare module "../../form/index.js" {
  interface ComponentProps {
    pinInputWidget: WidgetCommonProps<string>;
  }
  interface ComponentBindings {
    pinInputWidget: "value";
  }
}
