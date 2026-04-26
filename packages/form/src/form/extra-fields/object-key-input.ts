import type { FieldCommonProps } from "../fields.js";

declare module "../../form/index.js" {
  interface FoundationalComponents {
    objectKeyInputField: {};
  }
  interface ComponentProps {
    objectKeyInputField: FieldCommonProps<string>;
  }
  interface ComponentBindings {
    objectKeyInputField: "value";
  }
}
