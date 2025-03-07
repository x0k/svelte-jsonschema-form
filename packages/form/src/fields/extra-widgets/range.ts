import type { WidgetCommonProps } from "../widgets.js";

declare module "../../form/index.js" {
  interface ComponentProps {
    rangeWidget: WidgetCommonProps<number>;
  }
  interface ComponentBindings {
    rangeWidget: "value";
  }
}
