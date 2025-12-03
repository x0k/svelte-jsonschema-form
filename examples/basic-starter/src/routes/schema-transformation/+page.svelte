<script lang="ts">
  import {
    transformSchemaDefinition,
    isSchemaObject,
  } from "@sjsf/form/lib/json-schema";
  import { HashedKeyCache, LRUCache } from "@sjsf/form/lib/cache";
  import { weakMemoize } from "@sjsf/form/lib/memoize";
  import { fromFactories } from "@sjsf/form/lib/resolver";
  import { isSelect, schemaHash, type SchemaDefinition } from "@sjsf/form/core";
  import {
    SimpleForm,
    type Schema,
    type FormValue,
    type Config,
  } from "@sjsf/form";
  import { omitExtraData } from "@sjsf/form/omit-extra-data";
  import { resolver } from "@sjsf/form/resolvers/compat";
  import "@sjsf/form/fields/extra/enum-include";

  // https://github.com/sveltejs/svelte/issues/17220
  import * as _defaults from "$lib/form-defaults";

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

  const validator = defaults.validator<FormValue>({
    validatorsCache: new HashedKeyCache({
      getHash: weakMemoize(new WeakMap(), schemaHash),
      store: new LRUCache({
        maxSize: 10,
      }),
    }),
  });
  const merger = defaults.merger({
    validator,
    schema: originalSchema,
  });

  const VIRTUAL_PROPERTY = "__sjsf_virtual_property";
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
      const options = alt.map(toOption);
      properties[VIRTUAL_PROPERTY] = {
        title: copy.title ?? "Options",
        enum: options,
        default: options[0],
      };
      dependencies[VIRTUAL_PROPERTY] = {
        oneOf: alt.map((def, i) => {
          const option: Schema = {
            properties: {
              [VIRTUAL_PROPERTY]: {
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
        required: required.concat(VIRTUAL_PROPERTY),
        properties,
        dependencies,
      };
    }
  ) as Schema;
</script>

<SimpleForm
  {...defaults}
  validateByRetrievedSchema
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
    console.log(omitExtraData(validator, merger, originalSchema, value));
  }}
  extraUiOptions={fromFactories({
    hideTitle: ({ path }: Config) =>
      path.at(-1) === VIRTUAL_PROPERTY || undefined,
  })}
/>
