import type { FieldCommonProps } from "../fields.js";

declare module "../components.js" {
  interface FoundationalComponents {
    filesField: {};
  }
  interface ComponentProps {
    filesField: FieldCommonProps<string[]>;
  }
  interface ComponentBindings {
    filesField: "value";
  }
}
