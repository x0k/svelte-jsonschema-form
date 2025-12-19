<script lang="ts" generics="T">
  import { onDestroy } from 'svelte';

  import { createForm, type FormOptions } from "./create-form.svelte.js";
  import BasicForm from "./basic-form.svelte";

  const options: FormOptions<T> = $props();

  const form = createForm(options);
  onDestroy(() => {
    form.submission.abort()
    form.fieldsValidation.abort()
  })
</script>

<BasicForm {form} />
