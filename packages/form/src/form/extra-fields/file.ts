import type { FieldCommonProps } from "../fields.js";

declare module "../components.js" {
  interface ComponentProps {
    fileField: FieldCommonProps<string>;
  }
  interface ComponentBindings {
    fileField: "value";
  }
}
