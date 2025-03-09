import type { SchemaArrayValue } from "@/core/schema.js";

import type { FieldCommonProps } from "../fields.js";

declare module "../components.js" {
  interface ComponentProps {
    combinationEnumField: FieldCommonProps<SchemaArrayValue>;
  }
  interface ComponentBindings {
    combinationEnumField: "value";
  }
}
