import type { SchemaObjectValue } from "@/core/index.js";

import type { FieldCommonProps } from "../fields.js";

declare module "../components.js" {
  interface ComponentProps {
    rangeField: FieldCommonProps<SchemaObjectValue>;
  }
  interface ComponentBindings {
    rangeField: "value";
  }
}
