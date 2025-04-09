import type { WidgetCommonProps } from "../widgets.js";

declare module "../../form/index.js" {
  interface ComponentProps {
    tagsWidget: WidgetCommonProps<string[]>
  }
  interface ComponentBindings {
    tagsWidget: "value";
  }
}
