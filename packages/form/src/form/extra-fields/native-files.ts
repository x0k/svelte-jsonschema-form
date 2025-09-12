import type { FieldCommonProps } from "../fields.js";

declare module "../../core/index.js" {
  interface SchemaValues {
    file: File;
  }
}

declare module "../components.js" {
  interface ComponentProps {
    nativeFilesFields: FieldCommonProps<File[]>;
  }
  interface ComponentBindings {
    nativeFilesField: "value";
  }
}
