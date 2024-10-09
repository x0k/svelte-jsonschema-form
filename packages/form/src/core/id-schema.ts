// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/src/schema/toIdSchema.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import { deepEqual } from "@/lib/deep-equal.js";

import {
  ALL_OF_KEY,
  DEPENDENCIES_KEY,
  getSimpleSchemaType,
  ID_KEY,
  isNormalArrayItems,
  isSchema,
  isSchemaObjectValue,
  ITEMS_KEY,
  PROPERTIES_KEY,
  REF_KEY,
  retrieveSchema,
  type Schema,
  type SchemaObjectValue,
  type SchemaValue,
  type Validator,
} from "./schema/index.js";

export type FieldId = {
  $id: string;
};

export type IdSchema<T> = FieldId &
  (T extends { [key: string]: any }
    ? {
        [key in keyof T]?: IdSchema<T[key]>;
      }
    : {});

export const FAKE_ID_SCHEMA: IdSchema<SchemaValue> = {
  $id: "fake-id",
};

export function toIdSchema(
  validator: Validator,
  schema: Schema,
  idPrefix: string,
  idSeparator: string,
  _recurseList: Schema[],
  id?: string | null,
  rootSchema?: Schema,
  formData?: SchemaValue
): IdSchema<SchemaValue> {
  if (REF_KEY in schema || DEPENDENCIES_KEY in schema || ALL_OF_KEY in schema) {
    const _schema = retrieveSchema(validator, schema, rootSchema, formData);
    const sameSchemaIndex = _recurseList.findIndex((item) =>
      deepEqual(item, _schema)
    );
    if (sameSchemaIndex === -1) {
      return toIdSchema(
        validator,
        _schema,
        idPrefix,
        idSeparator,
        _recurseList.concat(_schema),
        id,
        rootSchema,
        formData
      );
    }
  }
  if (ITEMS_KEY in schema) {
    const items = schema[ITEMS_KEY];
    if (isNormalArrayItems(items) && !items[REF_KEY]) {
      return toIdSchema(
        validator,
        items,
        idPrefix,
        idSeparator,
        _recurseList,
        id,
        rootSchema,
        formData
      );
    }
  }
  const $id = id || idPrefix;
  const idSchema = { $id } as IdSchema<SchemaObjectValue>;
  if (getSimpleSchemaType(schema) === "object" && PROPERTIES_KEY in schema) {
    const properties = schema[PROPERTIES_KEY];
    const formDataObject = isSchemaObjectValue(formData) ? formData : undefined;
    for (const name in properties) {
      const field = properties[name]!;
      const fieldId = idSchema[ID_KEY] + idSeparator + name;
      idSchema[name] = toIdSchema(
        validator,
        isSchema(field) ? field : {},
        idPrefix,
        idSeparator,
        _recurseList,
        fieldId,
        rootSchema,
        formDataObject?.[name]
      );
    }
  }
  return idSchema as IdSchema<SchemaValue>;
}

export interface IdentifiableFieldElement {
  help: {};
  "key-input": {};
  examples: {};
}

export function computeId<T>(
  idSchema: IdSchema<T>,
  element: keyof IdentifiableFieldElement | string
) {
  return `${idSchema.$id}__${element}`;
}
