import type {
  ANY_OF_KEY,
  ONE_OF_KEY,
  SchemaArrayValue,
  SchemaObjectValue,
} from "@/core/index.js";
import type {
  Schema,
  ComponentProps,
  Config,
  SchemaValue,
  ComponentType,
} from "@/form/index.js";

export interface FieldCommonProps<V> {
  value: V | undefined;
  config: Config;
}

declare module "../form/index.js" {
  interface ComponentProps {
    multiField: FieldCommonProps<SchemaValue> & {
      combinationKey: typeof ONE_OF_KEY | typeof ANY_OF_KEY;
    };
    stringField: FieldCommonProps<string>;
    numberField: FieldCommonProps<number>;
    integerField: FieldCommonProps<number>;
    booleanField: FieldCommonProps<boolean>;
    objectField: FieldCommonProps<SchemaObjectValue>;
    objectPropertyField: FieldCommonProps<SchemaValue> & {
      property: string;
      isAdditional: boolean;
    };
    arrayField: FieldCommonProps<SchemaArrayValue>;
    fixedArrayField: FieldCommonProps<SchemaArrayValue>;
    normalArrayField: FieldCommonProps<SchemaArrayValue>;
    arrayItemField: FieldCommonProps<SchemaValue> & {
      index: number;
      canCopy: boolean;
      canRemove: boolean;
      canMoveUp: boolean;
      canMoveDown: boolean;
    };
    nullField: FieldCommonProps<null>;
    enumField: FieldCommonProps<SchemaValue>;
    multiEnumField: FieldCommonProps<SchemaArrayValue> & {
      itemSchema: Schema;
    };
    fileField: FieldCommonProps<string>;
    filesField: FieldCommonProps<string[]>;
    hiddenField: FieldCommonProps<SchemaValue>;
  }
  interface ComponentBindings {
    multiField: "value";
    stringField: "value";
    numberField: "value";
    integerField: "value";
    booleanField: "value";
    objectField: "value";
    objectPropertyField: "value";
    arrayField: "value";
    fixedArrayField: "value";
    normalArrayField: "value";
    arrayItemField: "value";
    nullField: "value";
    enumField: "value";
    multiEnumField: "value";
    fileField: "value";
    filesField: "value";
    hiddenField: "value";
  }
}
