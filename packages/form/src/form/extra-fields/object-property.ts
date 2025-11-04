import type { SchemaValue } from "@/core/index.js";

import type { FieldCommonProps } from "../fields.js";

declare module "../../form/index.js" {
  interface FoundationalComponents {
    objectPropertyField: {};
  }
  interface ComponentProps {
    objectPropertyField: FieldCommonProps<SchemaValue> & {
      property: string;
      isAdditional: boolean;
    };
  }
  interface ComponentBindings {
    objectPropertyField: "value";
  }
}
