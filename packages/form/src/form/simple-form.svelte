<script lang="ts" generics="T">
  import { onDestroy } from "svelte";

  import BasicForm from "./basic-form.svelte";
  import { createForm, type FormOptions } from "./create-form.svelte.js";

  const options: FormOptions<T> = $props();

  // svelte-ignore state_referenced_locally
  const form = createForm(options);
  onDestroy(() => {
    form.submission.abort();
    form.fieldsValidation.abort();
  });
</script>

<BasicForm {form} />
