import { type SchemaValue } from "@/form/index.js";

declare module "../field-actions.js" {
  interface FieldActionTypes {
    clearEdit: SchemaValue | undefined;
  }
}
