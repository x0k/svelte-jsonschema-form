import type { SchemaArrayValue } from '@/core/index.js';

import type { FieldCommonProps } from "../fields.js";

declare module "../components.js" {
  interface ComponentProps {
    filesField: FieldCommonProps<SchemaArrayValue>;
  }
  interface ComponentBindings {
    filesField: "value";
  }
}
