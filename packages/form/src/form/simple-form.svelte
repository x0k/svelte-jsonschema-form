<script lang="ts" generics="T, V extends Validator">
  import type { Validator } from "@/core/index.js";

  import { createForm, type FormOptions } from "./create-form.svelte.js";
  import BasicForm from "./basic-form.svelte";

  const options: FormOptions<T, V> = $props();

  const form = createForm(options);
</script>

<BasicForm {form} />
