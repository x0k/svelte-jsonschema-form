<script lang="ts" generics="T">
  import BasicForm from "./basic-form.svelte";
  import { createForm, type FormOptions } from "./create-form.svelte.js";

  const options: FormOptions<T> = $props();

  const form = createForm(options);
</script>

<BasicForm {form} />
