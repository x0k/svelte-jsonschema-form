<script lang="ts">
  import { focusOnFirstError } from "@sjsf/form/focus-on-first-error";

  import CustomForm from '@/components/custom-form.svelte';
  
  import { objectSchema, objectUiSchema } from "./_demo-schemas";
</script>

<CustomForm
  schema={objectSchema}
  uiSchema={objectUiSchema}
  onSubmitError={focusOnFirstError}
/>
