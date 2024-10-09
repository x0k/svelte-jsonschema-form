// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/src/optionsList.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import type { Schema, SchemaDefinition, SchemaValue } from "./schema/index.js";
import { getSchemaConstantValue } from "./schema/constant-schema.js";
import type { UiOptions, UiSchema } from "./ui-schema.js";

export interface SimpleEnumOption<T> {
  value: T;
  label: string;
  disabled: boolean;
}

export interface ComplexEnumOption<T> extends SimpleEnumOption<T> {
  schema: Schema;
}

export type EnumOption<T> = SimpleEnumOption<T> | ComplexEnumOption<T>;

function getAltSchemas(
  schema: Schema,
  uiSchema: UiSchema
): [SchemaDefinition[] | undefined, UiSchema[] | undefined] {
  return schema.anyOf
    ? [schema.anyOf, uiSchema.anyOf]
    : [schema.oneOf, uiSchema.oneOf];
}

export function createOptions(
  schema: Schema,
  uiSchema: UiSchema,
  uiOptions: UiOptions | undefined
): EnumOption<SchemaValue>[] | undefined {
  const enumValues = schema.enum;
  const disabledValues = new Set(uiOptions?.disabledEnumValues);
  if (enumValues) {
    const enumNames = uiOptions?.enumNames;
    return enumValues.map((value, i) => {
      const label = enumNames?.[i] ?? String(value);
      return { label, value, disabled: disabledValues.has(value) };
    });
  }
  const [altSchemas, altUiSchemas] = getAltSchemas(schema, uiSchema);
  return (
    altSchemas &&
    altSchemas.map((altSchemaDef, index) => {
      if (typeof altSchemaDef === "boolean") {
        throw new Error(`Invalid enum definition in anyOf ${index}`);
      }
      const value = getSchemaConstantValue(altSchemaDef);
      const label =
        altUiSchemas?.[index]?.["ui:options"]?.title ??
        altSchemaDef.title ??
        String(value);
      return {
        schema: altSchemaDef,
        label,
        value,
        disabled: disabledValues.has(value),
      };
    })
  );
}