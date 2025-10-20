<script lang="ts">
  import { chain, fromFactories } from "@sjsf/form/lib/resolver";
  import { getSimpleSchemaType } from "@sjsf/form/core";
  import {
    createForm,
    BasicForm,
    type Schema,
    type Config,
    type ActionField,
  } from "@sjsf/form";
  import OptionalObjectTemplate from "@sjsf/form/templates/extra/optional-object.svelte";
  import OptionalArrayTemplate from "@sjsf/form/templates/extra/optional-array.svelte";
  import OptionalMultiFieldTemplate from "@sjsf/form/templates/extra/optional-multi-field.svelte";
  import { clearEdit } from "@sjsf/form/fields/actions/clear-edit.svelte";

  import * as defaults from "$lib/form-defaults";

  const schema = {
    title: "test",
    properties: {
      nestedObjectOptional: {
        type: "object",
        properties: {
          test: {
            type: "string",
          },
          deepObjectOptional: {
            type: "object",
            properties: {
              deepTest: {
                type: "string",
              },
            },
          },
          deepObject: {
            type: "object",
            properties: {
              deepTest: {
                type: "string",
              },
            },
          },
          deepArrayOptional: {
            type: "array",
            items: {
              type: "string",
            },
          },
          deepArrayOptional2: {
            type: "array",
            items: {
              type: "string",
            },
          },
          deepArray: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
        required: ["deepObject", "deepArray"],
      },
      nestedArrayOptional: {
        type: "array",
        items: {
          type: "string",
        },
      },
      nestedObject: {
        type: "object",
        properties: {
          test: {
            type: "string",
          },
        },
      },
      nestedArray: {
        type: "array",
        items: {
          type: "string",
        },
      },
      optionalObjectWithOneofs: {
        oneOf: [
          {
            type: "object",
            properties: {
              name: {
                type: "string",
                default: "first_option",
                readOnly: true,
              },
            },
          },
          {
            type: "object",
            properties: {
              name: {
                type: "string",
                default: "second_option",
                readOnly: true,
              },
              flag: {
                type: "boolean",
                default: false,
              },
            },
          },
          {
            type: "object",
            properties: {
              name: {
                type: "string",
                default: "third_option",
                readOnly: true,
              },
              flag: {
                type: "boolean",
                default: false,
              },
              inner_obj: {
                type: "object",
                properties: {
                  foo: {
                    type: "string",
                  },
                },
              },
            },
          },
        ],
      },
      optionalArrayWithAnyofs: {
        anyOf: [
          {
            type: "array",
            items: {
              type: "string",
            },
          },
          {
            type: "array",
            items: {
              type: "number",
            },
          },
          {
            type: "array",
            items: {
              type: "object",
              properties: {
                test: {
                  type: "string",
                },
              },
            },
          },
        ],
      },
    },
    required: ["nestedObject", "nestedArray"],
  } as const satisfies Schema;

  const theme = chain(
    fromFactories({
      objectTemplate: (cfg: Config) =>
        !cfg.required && cfg.schema.properties
          ? OptionalObjectTemplate
          : undefined,
      arrayTemplate: (cfg: Config) =>
        !cfg.required ? OptionalArrayTemplate : undefined,
      multiFieldTemplate: (cfg: Config) =>
        !cfg.required ? OptionalMultiFieldTemplate : undefined,
    }),
    defaults.theme
  );

  const extraUiOptions = fromFactories({
    actions: ({ required, schema }: Config) => {
      if (!required) {
        let key: ActionField | undefined;
        if (schema.oneOf) {
          key = "oneOfField";
        } else if (schema.anyOf) {
          key = "anyOfField";
        } else {
          const type = getSimpleSchemaType(schema);
          if (type === "array") {
            key = "arrayField";
          } else if (type === "object" && schema.properties) {
            key = "objectField";
          }
        }
        if (key) {
          return { [key]: clearEdit };
        }
      }
      return undefined;
    },
  });

  const form = createForm({
    ...defaults,
    theme,
    schema,
    extraUiOptions,
    merger: (options) =>
      defaults.merger({
        ...options,
        emptyObjectFields: "populateRequiredDefaults",
      }),
    onSubmit: console.log,
  });
</script>

<BasicForm {form} />
