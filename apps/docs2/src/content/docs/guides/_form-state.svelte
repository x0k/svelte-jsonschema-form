<script lang="ts">
  import { BasicForm, type Schema } from "@sjsf/form";

  import { createMyForm } from "@/components/my-form";

  const schema: Schema = {
    type: "string",
    minLength: 10,
  };

  const form = createMyForm({
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
