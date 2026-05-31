<script lang="ts">
  import {
    Content,
    createForm,
    setFormContext,
    type FormOptions,
  } from "@sjsf/form";

  import ValueProbe from "./form-value-probe.svelte";

  const props: FormOptions<any> = $props();

  // svelte-ignore state_referenced_locally
  const form = createForm(props);

  setFormContext(form);
</script>

<Content />
<ValueProbe />
