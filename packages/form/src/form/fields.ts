import type {
  SchemaValue,
  SchemaArrayValue,
  SchemaObjectValue,
} from "@/core/index.js";

import type { Config } from "./config.js";
import type {
  ComponentProps,
  ComponentType,
  FoundationalComponentType,
} from "./components.js";
import type { UiOption } from "./ui-schema.js";
import type { Translate } from "./translation.js";

export interface FieldCommonProps<V> {
  type: "field";
  value: V | null | undefined;
  config: Config;
  uiOption: UiOption;
  translate: Translate;
}

export type FieldType = keyof {
  [T in ComponentType as ComponentProps[T] extends FieldCommonProps<any>
    ? T
    : never]: T;
};

export type FoundationalFieldType = keyof {
  [K in FieldType &
    FoundationalComponentType as FieldCommonProps<any> extends ComponentProps[K]
    ? K
    : never]: K;
};

export type ResolveFieldType = (config: Config) => FoundationalFieldType;

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
    unknownField: {};
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
    unknownField: FieldCommonProps<unknown>;
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
    unknownField: "value";
  }
}
