import type { DateInputType } from "../date-time.js";
import type { WidgetCommonProps } from "../widgets.js";

export interface DateInputWidgetProps extends WidgetCommonProps<Date> {
  inputType: DateInputType;
}

declare module "../../form/index.js" {
  interface ComponentProps {
    dateInputWidget: DateInputWidgetProps;
  }
  interface ComponentBindings {
    dateInputWidget: "value";
  }
}
