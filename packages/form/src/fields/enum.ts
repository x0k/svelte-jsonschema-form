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
  type EnumValueMapperBuilder,
} from "@/options.svelte.js";

function getAltSchemas(
  schema: Schema,
  uiSchema: UiSchema
): [SchemaDefinition[] | undefined, UiSchemaDefinition[] | undefined] {
  return schema.anyOf
    ? [schema.anyOf, uiSchema.anyOf]
    : [schema.oneOf, uiSchema.oneOf];
}

// TODO: Inline in v4
/** @deprecated use `createFormOptions` instead  */
export function createOptions<T>(
  ctx: FormState<T>,
  config: Config,
  uiOption: UiOption,
  schema: Schema,
  builder: EnumValueMapperBuilder = resolveEnumValueMapperBuilder(
    uiOption("enumValueMapperBuilder")
  )
) {
  const enumValues = schema.enum;
  const disabledValues = new Set(uiOption("disabledEnumValues"));
  if (enumValues) {
    const enumNames = uiOption("enumNames");
    return enumValues.map((value, index) => {
      const label = enumNames?.[index] ?? schemaValueToString(value);
      return createMappedOption(builder, {
        id: getPseudoId(ctx, config.path, index),
        label,
        value,
        disabled: disabledValues.has(value),
      });
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
      return createMappedOption(builder, {
        id: getPseudoId(ctx, config.path, index),
        schema: altSchemaDef,
        label,
        value,
        disabled: disabledValues.has(value),
      });
    })
  );
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
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  const options = createOptions(ctx, config, uiOption, schema, builder) ?? [];
  return { options, mapper: builder.build() };
}
