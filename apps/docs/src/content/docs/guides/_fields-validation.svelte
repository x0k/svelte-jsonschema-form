<script lang="ts">
  import { ON_CHANGE, ON_INPUT, AFTER_SUBMITTED, SimpleForm } from "@sjsf/form";

  import { createCustomForm } from "@/components/custom-form";

  import { objectSchema } from "./_demo-schemas";

  const form = createCustomForm({
    schema: objectSchema,
    fieldsValidationMode: ON_INPUT | ON_CHANGE | AFTER_SUBMITTED,
    onSubmit: console.log,
  });
</script>

<SimpleForm
  {form}
  novalidate
  style="display: flex; flex-direction: column; gap: 1rem"
/>
