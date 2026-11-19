import {
  getSchemaConstantValue,
  getXxxOfKey,
  schemaValueToString,
  type Schema,
} from "#core/index.js";
import {
  retrieveUiSchema,
  type Config,
  type UiOption,
  type FormState,
  getPseudoId,
  retrieveEnumValueMapperBuilder,
  type FormEnumOption,
} from "#form/index.js";
import { createMappedOption } from "#options.svelte.js";

export function createFormOptions<T>(
  ctx: FormState<T>,
  config: Config,
  uiOption: UiOption,
  schema: Schema
) {
  const builder = retrieveEnumValueMapperBuilder(ctx, config);
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

  const options: FormEnumOption[] = [];
  const key = getXxxOfKey(schema);
  if (key !== undefined) {
    const altSchemas = schema[key]!;
    const altUiSchemas = config.uiSchema[key];
    for (let i = 0; i < altSchemas.length; i++) {
      const schemaDef = altSchemas[i]!;
      if (typeof schemaDef === "boolean") {
        throw new Error(`Invalid enum definition in ${key} ${i}`);
      }
      const value = getSchemaConstantValue(schemaDef);
      const uiOptions = retrieveUiSchema(ctx, altUiSchemas?.[i])["ui:options"];
      const label =
        uiOptions?.title ?? schemaDef.title ?? schemaValueToString(value);
      options.push(
        createMappedOption(builder, {
          id: getPseudoId(ctx, config.path, i),
          schema: schemaDef,
          label,
          value,
          disabled: disabledValues.has(value),
          description: uiOptions?.description ?? schemaDef.description,
        })
      );
    }
  }
  return { options, mapper: builder.build() };
}

export function getSelectedOptionDescription(
  options: FormEnumOption[],
  mappedValue: string
) {
  return options.find((option) => option.mappedValue === mappedValue)
    ?.description;
}
