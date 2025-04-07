import { chain, fromFactories } from "@/lib/resolver.js";
import type { Config, Theme } from "@/form/index.js";

import type { WidgetCommonProps } from "../widgets.js";

declare module "../../form/index.js" {
  interface ComponentProps {
    datePickerWidget: WidgetCommonProps<string>;
  }
  interface ComponentBindings {
    datePickerWidget: "value";
  }
}

export function useDatePickerForDateFormat(theme: Theme) {
  return chain(
    fromFactories({
      textWidget: (config: Config) =>
        config.schema.format === "date"
          ? theme("datePickerWidget", config)
          : undefined,
    }),
    theme
  ) satisfies Theme;
}
