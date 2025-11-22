<script lang="ts">
  import {
    transformSchemaDefinition,
    isSchemaObject,
  } from "@sjsf/form/lib/json-schema";
  import { fromFactories } from "@sjsf/form/lib/resolver";
  import { isSelect, type SchemaDefinition } from "@sjsf/form/core";
  import {
    SimpleForm,
    type Schema,
    type FormValue,
    type Config,
  } from "@sjsf/form";
  import { omitExtraData } from "@sjsf/form/omit-extra-data";
  import { resolver } from "@sjsf/form/resolvers/compat";
  import "@sjsf/form/fields/extra/enum-include";

  import * as _defaults from "$lib/form-defaults";

  // https://github.com/sveltejs/svelte/issues/17220
  const defaults = { ..._defaults };

  const originalSchema: Schema = {
    title: "favouriteThings",
    anyOf: [
      {
        type: "object",
        properties: {
          favouriteAnimal: {
            type: "string",
          },
          favouriteColour: {
            type: "string",
          },
        },
        required: ["favouriteAnimal"],
      },
      {
        type: "object",
        properties: {
          favouriteAnimal: {
            type: "string",
          },
          favouriteColour: {
            type: "string",
          },
          favouritePerson: {
            type: "string",
          },
        },
        required: ["favouriteAnimal", "favouriteColour"],
      },
      {
        type: "object",
        properties: {
          favouritePerson: {
            type: "string",
          },
        },
        required: ["favouritePerson"],
      },
    ],
  };

  const validator = defaults.validator<FormValue>();
  const merger = defaults.merger({
    validator,
    schema: originalSchema,
  });

  const VIRTUAL_PROPERTY_PREFIX = "virtual:";
  const toOption = (def: SchemaDefinition, index: number) =>
    (isSchemaObject(def) && def.title) || `Option ${index + 1}`;

  const schema = transformSchemaDefinition<SchemaDefinition>(
    originalSchema,
    (copy) => {
      if (typeof copy === "boolean") {
        return copy;
      }
      const altKeyword = (copy.oneOf && "oneOf") ?? (copy.anyOf && "anyOf");
      const alt = altKeyword && copy[altKeyword];
      if (!alt || isSelect(validator, merger, copy, originalSchema)) {
        return copy;
      }
      const {
        [altKeyword]: _,
        properties = {},
        dependencies = {},
        required = [],
        ...rest
      } = copy;
      const property = `${VIRTUAL_PROPERTY_PREFIX}${altKeyword}`;
      const options = alt.map(toOption);
      properties[property] = {
        title: copy.title ?? "Options",
        enum: options,
        default: options[0],
      };
      dependencies[property] = {
        oneOf: alt.map((def, i) => {
          const option: Schema = {
            properties: {
              [property]: {
                const: toOption(def, i),
              },
            },
          };
          return typeof def === "boolean"
            ? option
            : merger.mergeSchemas(def, option);
        }),
      };
      return {
        ...rest,
        required: required.concat(property),
        properties,
        dependencies,
      };
    }
  ) as Schema;
</script>

<SimpleForm
  {...defaults}
  {resolver}
  {validator}
  {merger}
  {schema}
  uiSchema={{
    "ui:options": {
      form: {
        novalidate: true,
      },
    },
  }}
  onSubmit={(value) => {
    console.log({
      schema,
      value,
      omitted: omitExtraData(validator, merger, originalSchema, value),
    });
  }}
  extraUiOptions={fromFactories({
    hideTitle: ({ path }: Config) => {
      const last = path[path.length - 1];
      if (
        typeof last === "string" &&
        last.startsWith(VIRTUAL_PROPERTY_PREFIX)
      ) {
        return true;
      }
    },
  })}
/>
