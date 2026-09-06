<script lang="ts">
  import {
    BasicForm,
    createForm,
    setFormContext,
    type FormOptions,
  } from "@sjsf/form";

  const props: FormOptions<any> = $props();

  // svelte-ignore state_referenced_locally
  const form = createForm(props);

  setFormContext(form);
</script>

<BasicForm {form} />
