import type { WidgetCommonProps } from "../widgets.js";

// NOTE: naming convention
// A toggle is a general term for a UI element that allows switching between two states
// A switch is a specific type of toggle that mimics a physical light switch

declare module "@sjsf/form" {
  interface ComponentProps {
    switchWidget: WidgetCommonProps<boolean>;
  }
  interface ComponentBindings {
    switchWidget: "value";
  }
}
