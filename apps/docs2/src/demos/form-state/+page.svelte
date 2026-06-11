<script lang="ts">
  import {
    BasicForm,
    createForm,
    getErrors,
    getValueSnapshot,
    type Schema,
  } from "@sjsf/form";
  import type { DemoProps } from "@/lib/demo";

  const { defaults }: DemoProps = $props();

  const schema: Schema = {
    type: "string",
    minLength: 10,
  };

  const form = createForm({
    ...defaults,
    initialValue: "initial",
    schema,
    onSubmit: console.log,
  });
</script>

<BasicForm {form} novalidate />

<pre>{JSON.stringify(
    { value: getValueSnapshot(form), errors: Array.from(getErrors(form)) },
    null,
    2
  )}</pre>
