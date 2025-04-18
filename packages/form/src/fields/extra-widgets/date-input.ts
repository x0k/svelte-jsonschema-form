import { chain, fromFactories } from "@/lib/resolver.js";
import type { Config, Theme } from "@/form/index.js";

import type { WidgetCommonProps } from "../widgets.js";

declare module "../../form/index.js" {
  interface ComponentProps {
    dateInputWidget: WidgetCommonProps<string>;
  }
  interface ComponentBindings {
    dateInputWidget: "value";
  }
}

export function useDateInputForDateFormat(theme: Theme) {
  return chain(
    fromFactories({
      textWidget: (config: Config) =>
        config.schema.format === "date"
          ? theme("dateInputWidget", config)
          : undefined,
    }),
    theme
  ) satisfies Theme;
}
