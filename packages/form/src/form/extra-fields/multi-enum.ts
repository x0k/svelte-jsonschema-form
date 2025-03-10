import type { SchemaArrayValue } from "@/core/schema.js";

import type { FieldCommonProps } from "../fields.js";

declare module "../components.js" {
  interface FoundationalComponents {
    multiEnumField: {}
  }
  interface ComponentProps {
    multiEnumField: FieldCommonProps<SchemaArrayValue>;
  }
  interface ComponentBindings {
    multiEnumField: "value";
  }
}
