import type { Range } from "@/lib/range.js";
import type { SchemaValue } from "@/core/index.js";

import type { FieldCommonProps } from "../fields.js";

declare module "../components.js" {
  interface ComponentProps {
    rangeField: FieldCommonProps<Range<SchemaValue | undefined>>;
  }
  interface ComponentBindings {
    rangeFiled: "value";
  }
}
