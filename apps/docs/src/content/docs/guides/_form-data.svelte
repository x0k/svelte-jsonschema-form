<script lang="ts">
  import { type Schema, SimpleForm } from "@sjsf/form";

  import { useCustomForm } from "@/components/custom-form";

  const schema: Schema = {
    type: "string",
    minLength: 10,
  };

  const form = useCustomForm({
    initialValue: "initial",
    schema,
    onSubmit: console.log,
  });
</script>

<SimpleForm
  style="display: flex; flex-direction: column; gap: 1rem"
  novalidate
  {form}
/>

<pre>{JSON.stringify(
    { value: form.value, errors: Object.fromEntries(form.errors) },
    null,
    2
  )}</pre>
