import type { WidgetCommonProps } from "../widgets.js";

declare module "@sjsf/form" {
  interface ComponentProps {
    textareaWidget: WidgetCommonProps<string>;
  }
  interface ComponentBindings {
    textareaWidget: "value";
  }
}
