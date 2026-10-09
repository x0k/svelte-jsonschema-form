<script lang="ts">
  import {
    Content,
    createForm,
    setFormContext,
    SubmitButton,
    type FormOptions,
  } from "@sjsf/form";

  const { formOptions }: { formOptions: FormOptions<any> } = $props();

  // svelte-ignore state_referenced_locally
  const form = createForm(formOptions);
  setFormContext(form);
</script>

<Content />
<SubmitButton />
