import type { WidgetCommonProps } from "../widgets.js";

declare module "../../form/index.js" {
  interface ComponentProps {
    ratingWidget: WidgetCommonProps<number>;
  }
  interface ComponentBindings {
    ratingWidget: "value";
  }
}
