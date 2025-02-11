// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/src/optionsList.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import {
  getSchemaConstantValue,
  type EnumOption,
  type Schema,
  type SchemaDefinition,
  type SchemaValue,
} from "@/core/index.js";

import type { Id } from "./id.js";
import type { UiOptions, UiSchema } from "./ui-schema.js";

export const DEFAULT_BOOLEAN_ENUM = [true, false];

function getAltSchemas(
  schema: Schema,
  uiSchema: UiSchema
): [SchemaDefinition[] | undefined, UiSchema[] | undefined] {
  return schema.anyOf
    ? [schema.anyOf, uiSchema.anyOf]
    : [schema.oneOf, uiSchema.oneOf];
}

export function createOptions2(
  schema: Schema,
  uiSchema: UiSchema,
  uiOptions: UiOptions | undefined,
  computeId: (index: number) => Id
): EnumOption<SchemaValue>[] | undefined {
  const enumValues = schema.enum;
  const disabledValues = new Set(uiOptions?.disabledEnumValues);
  if (enumValues) {
    const enumNames = uiOptions?.enumNames;
    return enumValues.map((value, index) => {
      const label = enumNames?.[index] ?? String(value);
      return {
        id: computeId(index),
        label,
        value,
        disabled: disabledValues.has(value),
      };
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
        id: computeId(index),
        schema: altSchemaDef,
        label,
        value,
        disabled: disabledValues.has(value),
      };
    })
  );
}
