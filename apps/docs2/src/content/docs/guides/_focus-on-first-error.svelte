<script lang="ts">
  import { focusOnFirstError } from "@sjsf/form/focus-on-first-error";

  import MyForm from '@/components/my-form.svelte';
  
  import { objectSchema, objectUiSchema } from "./_demo-schemas";
</script>

<MyForm
  schema={objectSchema}
  uiSchema={objectUiSchema}
  onSubmitError={focusOnFirstError}
/>
