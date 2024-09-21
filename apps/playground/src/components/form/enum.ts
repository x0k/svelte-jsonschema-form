import type { Schema, SchemaDefinition, SchemaValue } from "./schema";
import { getSchemaConstantValue } from "./schema/constant";
import type { UiSchema } from "./ui-schema";

export interface SimpleEnumOption<T> {
  value: T;
  label: string;
}

export interface ComplexEnumOption<T> {
  value: T;
  label: string;
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
  uiSchema: UiSchema
): EnumOption<SchemaValue>[] | undefined {
  const enumValues = schema.enum;
  if (enumValues) {
    const enumNames = uiSchema["ui:options"]?.enumNames;
    return enumValues.map((value, i) => {
      const label = enumNames?.[i] ?? String(value);
      return { label, value };
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
      };
    })
  );
}
