import {
  getSchemaConstantValue,
  type EnumOption,
  type Schema,
  type SchemaDefinition,
  type SchemaValue,
} from "@/core/index.js";
import {
  type UiSchema,
  type UiSchemaDefinition,
  type Validator,
  type FormInternalContext,
  retrieveUiSchema,
  createPseudoId,
  type Config,
} from "@/form/index.js";

function getAltSchemas(
  schema: Schema,
  uiSchema: UiSchema
): [SchemaDefinition[] | undefined, UiSchemaDefinition[] | undefined] {
  return schema.anyOf
    ? [schema.anyOf, uiSchema.anyOf]
    : [schema.oneOf, uiSchema.oneOf];
}

export function createOptions<V extends Validator>(
  ctx: FormInternalContext<V>,
  config: Config,
  schema: Schema
): EnumOption<SchemaValue>[] | undefined {
  const enumValues = schema.enum;
  const disabledValues = new Set(config.uiOptions?.disabledEnumValues);
  if (enumValues) {
    const enumNames = config.uiOptions?.enumNames;
    return enumValues.map((value, index) => {
      const label = enumNames?.[index] ?? String(value);
      return {
        id: createPseudoId(config.id, index, ctx),
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
        String(value);
      return {
        id: createPseudoId(config.id, index, ctx),
        schema: altSchemaDef,
        label,
        value,
        disabled: disabledValues.has(value),
      };
    })
  );
}
