<script lang="ts">
  import { chain, fromFactories } from "@sjsf/form/lib/resolver";
  import { getSimpleSchemaType } from "@sjsf/form/core";
  import { createForm, BasicForm, type Schema, type Config } from "@sjsf/form";
  import { createFormMerger } from "@sjsf/form/mergers/modern";
  import OptionalObjectTemplate from "@sjsf/form/templates/extra/optional-object.svelte";
  import OptionalArrayTemplate from "@sjsf/form/templates/extra/optional-array.svelte";
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
        !cfg.required ? OptionalObjectTemplate : undefined,
      arrayTemplate: (cfg: Config) =>
        !cfg.required ? OptionalArrayTemplate : undefined,
    }),
    defaults.theme
  );

  const extraUiOptions = fromFactories({
    action: (cfg: Config) => {
      if (!cfg.required) {
        const type = getSimpleSchemaType(cfg.schema);
        if (type === "array" || type === "object") {
          return clearEdit;
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
      createFormMerger({
        ...options,
        emptyObjectFields: "populateRequiredDefaults",
      }),
    onSubmit: console.log,
  });
</script>

<BasicForm {form} />
