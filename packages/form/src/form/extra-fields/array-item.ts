import type { SchemaValue } from "@/core/index.js";

import type { FieldCommonProps } from "../fields.js";

declare module "../../form/index.js" {
  interface FoundationalComponents {
    arrayItemField: {};
  }
  interface ComponentProps {
    arrayItemField: FieldCommonProps<SchemaValue> & {
      index: number;
    };
  }
  interface ComponentBindings {
    arrayItemField: "value";
  }
}
