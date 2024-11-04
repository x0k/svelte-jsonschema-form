// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/src/schema/toIdSchema.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import { deepEqual } from "@/lib/deep-equal.js";

import {
  ALL_OF_KEY,
  defaultMerger,
  DEPENDENCIES_KEY,
  getSimpleSchemaType,
  ID_KEY,
  isNormalArrayItems,
  isSchema,
  isSchemaObjectValue,
  ITEMS_KEY,
  PROPERTIES_KEY,
  REF_KEY,
  retrieveSchema2,
  type Merger2,
  type Schema,
  type SchemaObjectValue,
  type SchemaValue,
  type Validator,
} from "@/core/index.js";

export const DEFAULT_ID_PREFIX = "root";

export const DEFAULT_ID_PROPERTY_SEPARATOR = ".";

/** @deprecated use `DEFAULT_ID_PROPERTY_SEPARATOR` */
export const DEFAULT_ID_SEPARATOR = DEFAULT_ID_PROPERTY_SEPARATOR;

export const DEFAULT_ID_INDEX_SEPARATOR = "@";

export const DEFAULT_PSEUDO_ID_SEPARATOR = "::";

export const DEFAULT_ID_CONFIG: IdConfig = {
  prefix: DEFAULT_ID_PREFIX,
  indexSeparator: DEFAULT_ID_INDEX_SEPARATOR,
  propertySeparator: DEFAULT_ID_PROPERTY_SEPARATOR,
  pseudoSeparator: DEFAULT_PSEUDO_ID_SEPARATOR,
};

export interface IdConfig {
  prefix: string;
  propertySeparator: string;
  indexSeparator: string;
  pseudoSeparator: string;
}

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

/**
 * @deprecated use `toIdSchema2`
 */
export function toIdSchema(
  validator: Validator,
  schema: Schema,
  idPrefix: string,
  idSeparator: string,
  _recurseList: Schema[],
  id?: string | null,
  rootSchema?: Schema,
  formData?: SchemaValue,
  merger = defaultMerger
): IdSchema<SchemaValue> {
  return toIdSchema2(
    validator,
    merger,
    schema,
    idPrefix,
    idSeparator,
    _recurseList,
    id,
    rootSchema,
    formData
  );
}

export function toIdSchema2(
  validator: Validator,
  merger: Merger2,
  schema: Schema,
  idPrefix: string,
  idPropertySeparator: string,
  _recurseList: Schema[],
  id?: string | null,
  rootSchema?: Schema,
  formData?: SchemaValue
): IdSchema<SchemaValue> {
  if (REF_KEY in schema || DEPENDENCIES_KEY in schema || ALL_OF_KEY in schema) {
    const _schema = retrieveSchema2(
      validator,
      merger,
      schema,
      rootSchema,
      formData
    );
    const sameSchemaIndex = _recurseList.findIndex((item) =>
      deepEqual(item, _schema)
    );
    if (sameSchemaIndex === -1) {
      return toIdSchema2(
        validator,
        merger,
        _schema,
        idPrefix,
        idPropertySeparator,
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
      return toIdSchema2(
        validator,
        merger,
        items,
        idPrefix,
        idPropertySeparator,
        _recurseList,
        id,
        rootSchema,
        formData
      );
    }
  }
  const $id = id ?? idPrefix;
  const idSchema = { $id } as IdSchema<SchemaObjectValue>;
  if (getSimpleSchemaType(schema) === "object" && PROPERTIES_KEY in schema) {
    const properties = schema[PROPERTIES_KEY];
    const formDataObject = isSchemaObjectValue(formData) ? formData : undefined;
    for (const name in properties) {
      const field = properties[name]!;
      const fieldId = idSchema[ID_KEY] + idPropertySeparator + name;
      idSchema[name] = toIdSchema2(
        validator,
        merger,
        isSchema(field) ? field : {},
        idPrefix,
        idPropertySeparator,
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
  oneof: {};
  anyof: {};
}

/**
 * @deprecated use `computePseudoId`
 */
export function computeId<T>(
  idSchema: IdSchema<T>,
  element: keyof IdentifiableFieldElement | number,
  pseudoIdSeparator = DEFAULT_PSEUDO_ID_SEPARATOR
) {
  return computePseudoId(pseudoIdSeparator, idSchema.$id, element);
}

export function computePseudoId(
  pseudoIdSeparator: string,
  instanceId: string,
  element: keyof IdentifiableFieldElement | number
) {
  return `${instanceId}${pseudoIdSeparator}${element}`;
}

/**
 * @deprecated use `pathToId2`
 */
export function pathToId(
  idPrefix: string,
  idSeparator: string,
  path: Array<string | number>,
  idIndexSeparator = DEFAULT_ID_INDEX_SEPARATOR
) {
  return pathToId2(
    {
      prefix: idPrefix,
      indexSeparator: idIndexSeparator,
      propertySeparator: idSeparator,
      pseudoSeparator: DEFAULT_PSEUDO_ID_SEPARATOR,
    },
    path
  );
}

export function pathToId2(
  { prefix, indexSeparator, propertySeparator }: IdConfig,
  path: Array<string | number>
) {
  if (path.length === 0) {
    return prefix;
  }
  let id = prefix;
  for (let i = 0; i < path.length; i++) {
    const component = path[i];
    id += `${typeof component === "number" ? indexSeparator : propertySeparator}${component}`;
  }
  return id;
}
