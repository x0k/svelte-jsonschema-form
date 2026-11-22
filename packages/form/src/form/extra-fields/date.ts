import type { FieldCommonProps } from "../fields.js";

declare module "../components.js" {
  interface FoundationalComponents {
    dateField: {};
  }
  interface ComponentProps {
    dateField: FieldCommonProps<string>;
  }
  interface ComponentBindings {
    dateField: "value";
  }
}
