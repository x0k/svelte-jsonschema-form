<script lang="ts">
  import { ON_CHANGE, ON_INPUT, AFTER_SUBMITTED } from "@sjsf/form";

  import CustomForm from "@/components/custom-form.svelte";

  import { objectSchema } from "./_demo-schemas";
</script>

<CustomForm
  schema={objectSchema}
  inputsValidationMode={ON_INPUT | ON_CHANGE | AFTER_SUBMITTED}
  novalidate
  onSubmit={console.log}
/>
