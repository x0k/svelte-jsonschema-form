<script lang="ts">
  import { createForm, BasicForm } from "@sjsf/form";
  import { adapt } from "@sjsf/form/validators/standard-schema";
  import { type } from "arktype";

  import * as defaults from "$lib/form-defaults";

  const schema = type({
    hello: "string",
  });

  const form = createForm({
    ...defaults,
    ...adapt(schema),
    uiSchema: {
      "ui:options": {
        title: "Basic form",
      },
      hello: {
        "ui:options": {
          title: "Hello",
        },
      },
    },
    onSubmit: console.log,
  });
</script>

<BasicForm {form} novalidate />
