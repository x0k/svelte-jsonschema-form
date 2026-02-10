<script lang="ts">
  import { SimpleForm, type Schema } from "@sjsf/form";

  import * as defaults from "@/lib/form/defaults";

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
