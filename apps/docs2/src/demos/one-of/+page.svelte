<script lang="ts">
  import { SimpleForm, type Schema } from "@sjsf/form";

  import { getDemoContext } from "@/lib/demo";

  const { defaults } = getDemoContext();

  const schema = {
    type: "object",
    properties: {
      common: {
        type: "string",
      },
    },
    oneOf: [
      {
        title: "Foo schema",
        properties: {
          foo: {
            type: "string",
          },
        },
      },
      {
        title: "Bar schema",
        properties: {
          bar: {
            type: "string",
          },
        },
      },
    ],
  } as const satisfies Schema;

  const initialValue = {
    common: "hello",
    bar: "world",
  };
</script>

<SimpleForm {...defaults} {schema} {initialValue} />
