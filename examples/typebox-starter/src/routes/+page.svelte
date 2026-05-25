<script lang="ts">
  import { createForm, BasicForm } from "@sjsf/form";
  import { adapt } from "@sjsf/form/validators/standard-schema";
  import Type from "typebox";

  import * as defaults from "$lib/form-defaults";
  import { StandardSchemaV1 } from '$lib/standard';

  const schema = StandardSchemaV1(Type.Object({
    hello: Type.String(),
  }));

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
