import type { SchemaValue } from "@/core/index.js";

import type { FieldCommonProps } from "../fields.js";

declare module "../components.js" {
  interface FoundationalComponents {
    remoteEnumField: {};
  }
  interface ComponentProps {
    remoteEnumField: FieldCommonProps<SchemaValue>;
  }
  interface ComponentBindings {
    remoteEnumField: "value";
  }
}
