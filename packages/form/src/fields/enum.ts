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
  type FormEnumOption,
} from "@/form/index.js";
import {
  IdEnumValueMapperBuilder,
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
  builder: EnumValueMapperBuilder = uiOption("enumValueMapperBuilder")?.() ??
    new IdEnumValueMapperBuilder()
): FormEnumOption[] | undefined {
  const enumValues = schema.enum;
  const disabledValues = new Set(uiOption("disabledEnumValues"));
  if (enumValues) {
    const enumNames = uiOption("enumNames");
    return enumValues.map((value, index) => {
      const label = enumNames?.[index] ?? schemaValueToString(value);
      const option: FormEnumOption = {
        id: getPseudoId(ctx, config.path, index),
        label,
        value,
        disabled: disabledValues.has(value),
      };
      option.mappedValue = builder.push(option);
      return option;
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
      const option: FormEnumOption = {
        id: getPseudoId(ctx, config.path, index),
        schema: altSchemaDef,
        label,
        value,
        disabled: disabledValues.has(value),
      };
      option.mappedValue = builder.push(option);
      return option;
    })
  );
}

export function createFormOptions<T>(
  ctx: FormState<T>,
  config: Config,
  uiOption: UiOption,
  schema: Schema
) {
  const builder =
    uiOption("enumValueMapperBuilder")?.() ?? new IdEnumValueMapperBuilder();
  const options = createOptions(ctx, config, uiOption, schema, builder) ?? [];
  return { options, mapper: builder.build() };
}
