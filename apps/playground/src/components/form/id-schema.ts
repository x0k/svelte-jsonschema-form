import { deepEqual } from "fast-equals";

import { isObject } from "@/lib/object";

import {
  ALL_OF_KEY,
  DEPENDENCIES_KEY,
  ID_KEY,
  ITEMS_KEY,
  PROPERTIES_KEY,
  REF_KEY,
  retrieveSchema,
  typeOfSchema,
  type Schema,
  type Validator,
} from "./schema";

export type FieldId = {
  $id: string;
};

export type IdSchema<T> = FieldId &
  (T extends { [key: string]: any }
    ? {
        [key in keyof T]?: IdSchema<T[key]>;
      }
    : {});

export function toIdSchema<T>(
  validator: Validator<T>,
  schema: Schema,
  idPrefix: string,
  idSeparator: string,
  _recurseList: Schema[],
  id?: string | null,
  rootSchema?: Schema,
  formData?: T
): IdSchema<T> {
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
    if (typeof items === "object" && !Array.isArray(items) && !items[REF_KEY]) {
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
  const idSchema = { $id } as IdSchema<Record<string, T>>;
  if (typeOfSchema(schema) === "object" && PROPERTIES_KEY in schema) {
    const properties = schema[PROPERTIES_KEY];
    const formDataObject = isObject(formData)
      ? (formData as Record<string, T>)
      : undefined;
    for (const name in properties) {
      const field = properties[name];
      const fieldId = idSchema[ID_KEY] + idSeparator + name;
      idSchema[name] = toIdSchema(
        validator,
        isObject(field) ? field : {},
        idPrefix,
        idSeparator,
        _recurseList,
        fieldId,
        rootSchema,
        formDataObject?.[name]
      );
    }
  }
  return idSchema as IdSchema<T>;
}
