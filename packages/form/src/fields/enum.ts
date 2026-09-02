import {
  getSchemaConstantValue,
  schemaValueToString,
  type Schema,
  type SchemaDefinition,
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
import {
  createMappedOption,
  resolveEnumValueMapperBuilder,
} from "@/options.svelte.js";

function getAltSchemas(
  schema: Schema,
  uiSchema: UiSchema
): [SchemaDefinition[] | undefined, UiSchemaDefinition[] | undefined] {
  return schema.anyOf
    ? [schema.anyOf, uiSchema.anyOf]
    : [schema.oneOf, uiSchema.oneOf];
}

export function createFormOptions<T>(
  ctx: FormState<T>,
  config: Config,
  uiOption: UiOption,
  schema: Schema
) {
  const builder = resolveEnumValueMapperBuilder(
    uiOption("enumValueMapperBuilder")
  );
  const disabledValues = new Set(uiOption("disabledEnumValues"));

  const enumValues = schema.enum;
  if (enumValues) {
    const enumNames = uiOption("enumNames");
    const options = enumValues.map((value, index) => {
      const label = enumNames?.[index] ?? schemaValueToString(value);
      return createMappedOption(builder, {
        id: getPseudoId(ctx, config.path, index),
        label,
        value,
        disabled: disabledValues.has(value),
      });
    });
    return { options, mapper: builder.build() };
  }

  const [altSchemas, altUiSchemas] = getAltSchemas(schema, config.uiSchema);
  const options =
    altSchemas?.map((altSchemaDef, index) => {
      if (typeof altSchemaDef === "boolean") {
        throw new Error(`Invalid enum definition in anyOf ${index}`);
      }
      const value = getSchemaConstantValue(altSchemaDef);
      const label =
        retrieveUiSchema(ctx, altUiSchemas?.[index])["ui:options"]?.title ??
        altSchemaDef.title ??
        schemaValueToString(value);
      return createMappedOption(builder, {
        id: getPseudoId(ctx, config.path, index),
        schema: altSchemaDef,
        label,
        value,
        disabled: disabledValues.has(value),
      });
    }) ?? [];

  return { options, mapper: builder.build() };
}
