<script lang="ts">
  import { focusOnFirstError } from "@sjsf/form/focus-on-first-error";

  import { CustomForm } from "@/components/custom-form";

  import { objectSchema } from "./_demo-schemas";
</script>

<CustomForm
  schema={objectSchema}
  novalidate
  onSubmitError={focusOnFirstError}
/>
