import type {
  SchemaValue,
  SchemaArrayValue,
  SchemaObjectValue,
} from "@/core/index.js";

import type { Config } from "./config.js";
import type { ComponentProps, FoundationalComponent } from "./components.js";

export interface FieldCommonProps<V> {
  type: "field"
  value: V | undefined;
  config: Config;
}

export type FoundationalFieldType = {
  [K in FoundationalComponent]: FieldCommonProps<any> extends ComponentProps[K]
    ? K
    : never;
}[FoundationalComponent];

export type ResolveFieldType = (config: Config) => FoundationalFieldType

declare module "./components.js" {
  interface FoundationalComponents {
    stringField: {};
    numberField: {};
    integerField: {};
    booleanField: {};
    objectField: {};
    arrayField: {};
    tupleField: {};
    nullField: {};
    oneOfField: {};
    anyOfField: {};
  }
  interface ComponentProps {
    stringField: FieldCommonProps<string>;
    numberField: FieldCommonProps<number>;
    integerField: FieldCommonProps<number>;
    booleanField: FieldCommonProps<boolean>;
    objectField: FieldCommonProps<SchemaObjectValue>;
    arrayField: FieldCommonProps<SchemaArrayValue>;
    tupleField: FieldCommonProps<SchemaArrayValue>;
    nullField: FieldCommonProps<null>;
    oneOfField: FieldCommonProps<SchemaValue>;
    anyOfField: FieldCommonProps<SchemaValue>;
  }
  interface ComponentBindings {
    stringField: "value";
    numberField: "value";
    integerField: "value";
    booleanField: "value";
    objectField: "value";
    arrayField: "value";
    tupleField: "value";
    nullField: "value";
    oneOfField: "value";
    anyOfField: "value";
  }
}
