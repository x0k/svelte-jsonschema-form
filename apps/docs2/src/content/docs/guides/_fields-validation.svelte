<script lang="ts">
  import { ON_CHANGE, ON_INPUT, ON_BLUR } from "@sjsf/form";

  import CustomForm from "@/components/custom-form.svelte";

  import { objectSchema, objectUiSchema } from "./_demo-schemas";
</script>

<CustomForm
  schema={objectSchema}
  uiSchema={objectUiSchema}
  fieldsValidationMode={ON_INPUT | ON_CHANGE | ON_BLUR}
/>
