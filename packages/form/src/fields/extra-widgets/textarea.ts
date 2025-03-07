import type { WidgetCommonProps } from "../widgets.js";

declare module "../../form/index.js" {
  interface ComponentProps {
    textareaWidget: WidgetCommonProps<string>;
  }
  interface ComponentBindings {
    textareaWidget: "value";
  }
}
