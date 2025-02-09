import type { SchemaArrayValue, SchemaObjectValue } from "@/core/index.js";
import type {
  Schema,
  Components,
  Config,
  SchemaValue,
  ComponentType,
} from "@/form/index.js";

interface FieldCommonProps<V> {
  value: V | undefined;
  config: Config;
}

declare module "@/form/index.js" {
  interface Components {
    multiField: FieldCommonProps<SchemaValue>;
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
    arrayLikeField: FieldCommonProps<SchemaArrayValue> & {
      field: "multiEnum" | "files";
    };
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
    arrayLikeField: "value";
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

export type FieldType = {
  [T in ComponentType]: T extends `${infer K}Field` ? K : never;
}[ComponentType];

export type FieldProps<T extends FieldType> = Components[`${T}Field`];
