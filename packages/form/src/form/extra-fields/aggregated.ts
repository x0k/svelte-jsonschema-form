import type { SchemaObjectValue } from "@/core/index.js";

import type { FieldCommonProps } from "../fields.js";

declare module "../components.js" {
  interface ComponentProps {
    aggregatedField: FieldCommonProps<SchemaObjectValue>;
  }
  interface ComponentBindings {
    aggregatedField: "value"
  }
}
