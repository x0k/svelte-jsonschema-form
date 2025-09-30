<script lang="ts">
  import { BasicForm, createForm, getErrors, type Schema } from "@sjsf/form";

  import * as defaults from "@/lib/form/defaults";

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
    { value: form.value, errors: Array.from(getErrors(form)) },
    null,
    2
  )}</pre>
