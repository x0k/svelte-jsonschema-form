<script lang="ts" generics="I, O">
  import { createForm, type FormOptions } from "./create-form.svelte.js";
  import BasicForm from "./basic-form.svelte";

  const options: FormOptions<I, O> = $props();

  const form = createForm(options);
</script>

<BasicForm {form} />
