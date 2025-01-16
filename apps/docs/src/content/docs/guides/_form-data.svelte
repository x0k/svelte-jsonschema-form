<script lang="ts">
  import { RawForm, type Schema } from "@sjsf/form";

  import { createCustomForm } from "@/components/custom-form";

  const schema: Schema = {
    type: "string",
    minLength: 10,
  };

  const form = createCustomForm({
    initialValue: "initial",
    schema,
    onSubmit: console.log,
  });
</script>

<RawForm {form} novalidate />

<pre>{JSON.stringify(
    { value: form.value, errors: Object.fromEntries(form.errors) },
    null,
    2
  )}</pre>
