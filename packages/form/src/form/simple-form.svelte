<script lang="ts" generics="T">
  import { createForm, type FormOptions } from "./create-form.svelte.js";
  import BasicForm from "./basic-form.svelte";

  const options: FormOptions<T> = $props();

  const form = createForm(options);
</script>

<BasicForm {form} />
