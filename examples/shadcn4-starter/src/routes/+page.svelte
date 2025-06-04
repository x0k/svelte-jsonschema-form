<script lang="ts">
  import { createForm, BasicForm, type Schema } from "@sjsf/form";
  import { setThemeContext } from '@sjsf/shadcn4-theme'
  import * as components from '@sjsf/shadcn4-theme/new-york'

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

  setThemeContext({ components })
</script>

<BasicForm style="padding: 2rem;" {form} />
