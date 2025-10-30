<script lang="ts">
  import { createForm, BasicForm, type Schema } from "@sjsf/form";

  import * as defaults from "$lib/form-defaults";

  const schema = {
    type: "object",
    title: "Basic form",
    properties: {
      hello: {
        title: "Hello",
        type: "string",
      },
    },
    required: ["hello"],
  } as const satisfies Schema;

  const form = createForm({
    ...defaults,
    schema,
    onSubmit: console.log,
  });

</script>

<BasicForm {form} />
