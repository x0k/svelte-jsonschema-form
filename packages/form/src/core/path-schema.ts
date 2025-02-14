// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/src/schema/toPathSchema.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import { retrieveSchema2 } from "./resolve.js";
import {
  ALL_OF_KEY,
  DEPENDENCIES_KEY,
  isSchema,
  REF_KEY,
  type Schema,
  type SchemaArrayValue,
  type SchemaDefinition,
  type SchemaObjectValue,
  type SchemaValue,
} from "./schema.js";
import type { Validator } from "./validator.js";
import { getDiscriminatorFieldFromSchema } from "./discriminator.js";
import { isSchemaObjectValue } from "./value.js";
import type { Merger2 } from './merger.js';
import { defaultMerger } from './merger.js';
import { getClosestMatchingOption } from './matching.js';
import { isSchemaDeepEqual } from './deep-equal.js';

export const SJSF_ADDITIONAL_PROPERTIES_FLAG = "__sjsf_additionalProperties";

export type FieldPath = {
  $name: string;
  [SJSF_ADDITIONAL_PROPERTIES_FLAG]?: boolean;
};

export type PathSchema<T = any> =
  T extends Array<infer U>
    ? FieldPath & {
        [key: number]: PathSchema<U>;
      }
    : T extends Record<string, any>
      ? FieldPath & {
          [key in keyof T]?: PathSchema<T[key]>;
        }
      : FieldPath;

export const NAME_KEY = "$name";

/**
 * @deprecated use `toPathSchema2`
 */
export function toPathSchema(
  validator: Validator,
  schema: Schema,
  name = "",
  rootSchema: Schema = schema,
  formData?: SchemaValue,
  merger= defaultMerger
) {
  return toPathSchemaInternal(validator, merger, schema, name, rootSchema, formData);
}

export function toPathSchema2(
  validator: Validator,
  merger: Merger2,
  schema: Schema,
  name = "",
  rootSchema: Schema = schema,
  formData?: SchemaValue
) {
  return toPathSchemaInternal(validator, merger, schema, name, rootSchema, formData);
}

function toPathSchemaInternal(
  validator: Validator,
  merger: Merger2,
  schema: SchemaDefinition,
  name: string,
  rootSchema: Schema,
  formData?: SchemaValue,
  _recurseList: Schema[] = []
): PathSchema<SchemaValue> {
  let pathSchema: PathSchema<SchemaValue> = {
    [NAME_KEY]: name.replace(/^\./, ""),
  };

  if (typeof schema === "boolean") {
    return pathSchema;
  }

  if (REF_KEY in schema || DEPENDENCIES_KEY in schema || ALL_OF_KEY in schema) {
    const _schema = retrieveSchema2(validator, merger, schema, rootSchema, formData);
    const sameSchemaIndex = _recurseList.findIndex((item) =>
      isSchemaDeepEqual(item, _schema)
    );
    if (sameSchemaIndex === -1) {
      return toPathSchemaInternal(
        validator,
        merger,
        _schema,
        name,
        rootSchema,
        formData,
        _recurseList.concat(_schema)
      );
    }
  }

  const combinationValue = schema.oneOf ?? schema.anyOf;
  if (Array.isArray(combinationValue)) {
    const discriminator = getDiscriminatorFieldFromSchema(schema);
    const schemas = combinationValue.filter(isSchema);
    const index = getClosestMatchingOption(
      validator,
      merger,
      rootSchema,
      formData,
      schemas,
      0,
      discriminator
    );
    const _schema = schemas[index]!;
    pathSchema = {
      ...pathSchema,
      ...toPathSchemaInternal(
        validator,
        merger,
        _schema,
        name,
        rootSchema,
        formData,
        _recurseList
      ),
    };
  }

  if (schema.additionalProperties) {
    pathSchema[SJSF_ADDITIONAL_PROPERTIES_FLAG] = true;
  }

  const schemaItems = schema.items;
  const schemaProperties = schema.properties;
  if (schemaItems && Array.isArray(formData)) {
    const { additionalItems: schemaAdditionalItems } = schema;
    const arrayPathSchema = pathSchema as PathSchema<SchemaArrayValue>;
    if (Array.isArray(schemaItems)) {
      formData.forEach((element, i: number) => {
        if (schemaItems[i]) {
          arrayPathSchema[i] = toPathSchemaInternal(
            validator,
            merger,
            schemaItems[i],
            `${name}.${i}`,
            rootSchema,
            element,
            _recurseList
          );
        } else if (schemaAdditionalItems) {
          arrayPathSchema[i] = toPathSchemaInternal(
            validator,
            merger,
            schemaAdditionalItems,
            `${name}.${i}`,
            rootSchema,
            element,
            _recurseList
          );
        } else {
          console.warn(
            `Unable to generate path schema for "${name}.${i}". No schema defined for it`
          );
        }
      });
    } else {
      formData.forEach((element, i: number) => {
        arrayPathSchema[i] = toPathSchemaInternal(
          validator,
          merger,
          schemaItems,
          `${name}.${i}`,
          rootSchema,
          element,
          _recurseList
        );
      });
    }
  } else if (schemaProperties !== undefined) {
    const objectFormData = isSchemaObjectValue(formData) ? formData : {};
    for (const property in schemaProperties) {
      const field = schemaProperties[property]!;
      (pathSchema as PathSchema<SchemaObjectValue>)[property] =
        toPathSchemaInternal(
          validator,
          merger,
          field,
          `${name}.${property}`,
          rootSchema,
          // It's possible that formData is not an object -- this can happen if an
          // array item has just been added, but not populated with data yet
          objectFormData[property],
          _recurseList
        );
    }
  }
  return pathSchema;
}
