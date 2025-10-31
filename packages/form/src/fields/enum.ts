import {
  getSchemaConstantValue,
  schemaValueToString,
  type EnumOption,
  type Schema,
  type SchemaDefinition,
  type SchemaValue,
} from "@/core/index.js";
import {
  type UiSchema,
  type UiSchemaDefinition,
  retrieveUiSchema,
  type Config,
  type UiOption,
  type FormState,
  getPseudoId,
} from "@/form/index.js";

function getAltSchemas(
  schema: Schema,
  uiSchema: UiSchema
): [SchemaDefinition[] | undefined, UiSchemaDefinition[] | undefined] {
  return schema.anyOf
    ? [schema.anyOf, uiSchema.anyOf]
    : [schema.oneOf, uiSchema.oneOf];
}

export function createOptions<T>(
  ctx: FormState<T>,
  config: Config,
  uiOption: UiOption,
  schema: Schema
): EnumOption<SchemaValue>[] | undefined {
  const enumValues = schema.enum;
  const disabledValues = new Set(uiOption("disabledEnumValues"));
  if (enumValues) {
    const enumNames = uiOption("enumNames");
    return enumValues.map((value, index) => {
      const label = enumNames?.[index] ?? schemaValueToString(value);
      return {
        id: getPseudoId(ctx, config.path, index),
        label,
        value,
        disabled: disabledValues.has(value),
      };
    });
  }
  const [altSchemas, altUiSchemas] = getAltSchemas(schema, config.uiSchema);
  return (
    altSchemas &&
    altSchemas.map((altSchemaDef, index) => {
      if (typeof altSchemaDef === "boolean") {
        throw new Error(`Invalid enum definition in anyOf ${index}`);
      }
      const value = getSchemaConstantValue(altSchemaDef);
      const label =
        retrieveUiSchema(ctx, altUiSchemas?.[index])["ui:options"]?.title ??
        altSchemaDef.title ??
        schemaValueToString(value);
      return {
        id: getPseudoId(ctx, config.path, index),
        schema: altSchemaDef,
        label,
        value,
        disabled: disabledValues.has(value),
      };
    })
  );
}
