<script lang="ts" generics="T, E, FV extends FormValidator<E>">
  import { createForm, type FormOptions } from "./form.svelte.js";
  import type { FormValidator } from "./validator.js";
  import BasicForm from "./basic-form.svelte";

  const options: FormOptions<T, E, FV> = $props();

  const form = createForm(options);
</script>

<BasicForm {form} />
