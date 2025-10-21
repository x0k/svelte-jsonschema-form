<script lang="ts">
  import { overrideByRecord } from "@sjsf/form/lib/resolver";
  import {
    createForm,
    BasicForm,
    type Schema,
    type UiSchemaRoot,
  } from "@sjsf/form";

  import * as defaults from "$lib/form-defaults";

  import Layout from "./layout.svelte";

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

  const uiSchema: UiSchemaRoot = {
    "ui:options": {
      myLayoutSlots: {
        "object-field-meta": {
          afterLayout: greeting,
        },
      },
    },
  };

  const form = createForm({
    ...defaults,
    theme: overrideByRecord(defaults.theme, { layout: Layout }),
    schema,
    uiSchema,
    onSubmit: console.log,
  });
</script>

<BasicForm {form} />
{#snippet greeting()}
  <p>
    Hi, in this example you can see how you can add text and any other content
    to a form.
  </p>
  <p>
    Of course you can use `nullField` to create text fields, but this changes
    the data model, which may not be acceptable in some situations.
  </p>
{/snippet}

<style>
  p {
    margin: 0;
  }
</style>
