import type { SchemaValue } from "@/core/index.js";

import type { FieldCommonProps } from "../fields.js";

declare module "../components.js" {
  interface FoundationalComponents {
    enumField: {};
  }
  interface ComponentProps {
    enumField: FieldCommonProps<SchemaValue>;
  }
  interface ComponentBindings {
    enumField: "value";
  }
}
