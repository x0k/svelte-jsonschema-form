<script lang="ts">
  import { BasicForm, createForm, type Schema } from "@sjsf/form";

  import * as defaults from "@/components/form-defaults";

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
    { value: form.value, errors: Object.fromEntries(form.errors) },
    null,
    2
  )}</pre>
