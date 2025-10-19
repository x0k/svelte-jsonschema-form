import { type SchemaValue } from "@/form/index.js";

declare module "../field-actions.js" {
  interface FieldActionTypes {
    clear: SchemaValue | undefined;
  }
}

