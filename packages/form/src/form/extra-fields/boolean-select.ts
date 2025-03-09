import type { FieldCommonProps } from "../fields.js";

declare module "../components.js" {
  interface ComponentProps {
    booleanSelectField: FieldCommonProps<boolean>;
  }
  interface ComponentBindings {
    booleanSelectField: "value";
  }
}
