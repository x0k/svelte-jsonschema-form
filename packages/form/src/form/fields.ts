import type {
  SchemaValue,
  SchemaArrayValue,
  SchemaObjectValue,
  ONE_OF_KEY,
  ANY_OF_KEY,
} from "@/core/index.js";

import type { Config } from "./config.js";

export interface FieldCommonProps<V> {
  value: V | undefined;
  config: Config;
}

declare module "./components.js" {
  interface FoundationalComponents {
    rootField: {};
    stringField: {};
    numberField: {};
    integerField: {};
    booleanField: {};
    objectField: {};
    arrayField: {};
    nullField: {};
    combinationField: {};
  }
  interface ComponentProps {
    rootField: FieldCommonProps<SchemaValue>;
    stringField: FieldCommonProps<string>;
    numberField: FieldCommonProps<number>;
    integerField: FieldCommonProps<number>;
    booleanField: FieldCommonProps<boolean>;
    objectField: FieldCommonProps<SchemaObjectValue>;
    arrayField: FieldCommonProps<SchemaArrayValue>;
    nullField: FieldCommonProps<null>;
    combinationField: FieldCommonProps<SchemaValue> & {
      combinationKey: typeof ONE_OF_KEY | typeof ANY_OF_KEY;
    };
  }
  interface ComponentBindings {
    rootField: "value";
    stringField: "value";
    numberField: "value";
    integerField: "value";
    booleanField: "value";
    objectField: "value";
    arrayField: "value";
    nullField: "value";
    combinationField: "value";
  }
}
