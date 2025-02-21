<script lang="ts" generics="T, VE, V extends FormValidator<VE>">
  import { createForm, type FormOptions } from "./create-form.svelte.js";
  import type { FormValidator } from "./validator.js";
  import CompositeForm from "./composite-form.svelte";

  const options: FormOptions<T, VE, V> = $props();

  const form = createForm(options);
</script>

<CompositeForm {form} />
