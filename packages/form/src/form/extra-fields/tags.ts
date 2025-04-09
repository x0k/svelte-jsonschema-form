import type { FieldCommonProps } from "../fields.js";

declare module "../components.js" {
  interface ComponentProps {
    tagsField: FieldCommonProps<string[]>;
  }
  interface ComponentBindings {
    tagsField: "value";
  }
}
