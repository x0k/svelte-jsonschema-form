<script lang="ts">
  import { SimpleForm } from "@sjsf/form";
  import { focusOnFirstError } from "@sjsf/form/focus-on-first-error";

  import { useCustomForm } from "@/components/custom-form";

  import { objectSchema } from "./_demo-schemas";

  const form = useCustomForm({
    schema: objectSchema,
    onSubmit: console.log,
    onSubmitError: focusOnFirstError,
  });
</script>

<SimpleForm
  {form}
  novalidate
  style="display: flex; flex-direction: column; gap: 1rem"
/>
