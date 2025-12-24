import type { WidgetCommonProps } from "../widgets.js";

declare module "../../form/index.js" {
  interface ComponentProps {
    passwordInputWidget: WidgetCommonProps<string>;
  }
  interface ComponentBindings {
    passwordInputWidget: "value";
  }
}
