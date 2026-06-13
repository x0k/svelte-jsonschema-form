<script lang="ts">
  import { type Schema, SimpleForm, type UiSchemaRoot } from "@sjsf/form";
  import type { FromSchema } from "json-schema-to-ts";

  import { getDemoContext } from "@/lib/demo";

  const { defaults } = getDemoContext();

  const schema = {
    type: "object",
    properties: {
      array: {
        type: "array",
        items: {
          type: "number",
        },
      },
    },
    additionalProperties: {
      type: "string",
    },
  } as const satisfies Schema;

  const uiSchema: UiSchemaRoot = {
    array: {
      "ui:options": {
        copyable: true,
      },
    },
  };

  type Model = FromSchema<typeof schema>;

  const initialValue: Model = {
    array: [1, 2, 3],
    foo: "bar",
    baz: "quz",
  };
</script>

<SimpleForm {...defaults} {schema} {uiSchema} {initialValue} />
