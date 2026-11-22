import type { FieldCommonProps } from "../fields.js";

declare module "../../core/index.js" {
  interface SchemaValues {
    date: Date;
  }
}

declare module "../components.js" {
  interface ComponentProps {
    nativeDateField: FieldCommonProps<Date>;
  }
  interface ComponentBindings {
    nativeDateField: "value";
  }
}
