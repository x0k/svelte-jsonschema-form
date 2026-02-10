<script lang="ts">
  import { SimpleForm, type Schema, type UiSchema } from "@sjsf/form";

  import * as defaults from "@/lib/form/defaults";

  const schema = {
    type: "object",
    properties: {
      foo: {
        type: "string",
        description:
          "If you enter anything here then `bar` will become required",
      },
      bar: {
        type: "string",
        description: "If you enter anything here then `baz` will appear",
      },
    },
    dependencies: {
      foo: ["bar"],
      bar: {
        properties: {
          baz: {
            enum: ["string", "number", "boolean"],
            description:
              "If you select anything here, the corresponding field will appear",
          },
        },
      },
      baz: {
        oneOf: [
          {
            properties: {
              baz: {
                const: "string",
              },
              string: {
                type: "string",
              },
            },
          },
          {
            properties: {
              baz: {
                const: "number",
              },
              number: {
                type: "number",
              },
            },
          },
          {
            properties: {
              baz: {
                const: "boolean",
              },
              boolean: {
                type: "boolean",
              },
            },
          },
        ],
      },
    },
  } as const satisfies Schema;

  const uiSchema: UiSchema = {
    baz: {
      "ui:components": {
        stringField: "enumField",
      },
    },
  };
</script>

<SimpleForm {...defaults} {schema} {uiSchema} />
