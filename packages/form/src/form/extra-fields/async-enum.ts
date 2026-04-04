import type { SchemaValue } from "@/core/index.js";

import type { FieldCommonProps } from "../fields.js";

declare module "../components.js" {
  interface FoundationalComponents {
    asyncEnumField: {};
  }
  interface ComponentProps {
    asyncEnumField: FieldCommonProps<SchemaValue>;
  }
  interface ComponentBindings {
    asyncEnumField: "value";
  }
}
