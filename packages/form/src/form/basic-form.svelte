<script lang="ts">
  import type { HTMLFormAttributes } from "svelte/elements";

  import type { FormInternals } from "./form.svelte.js";
  import { setFromContext } from "./context/context.js";
  import Content from "./content.svelte";
  import FormTag from "./form-tag.svelte";
  import SubmitButton from "./submit-button.svelte";

  let {
    ref = $bindable(),
    form,
    ...attributes
  }: {
    form: FormInternals<any, any>;
    ref?: HTMLFormElement | undefined;
  } & HTMLFormAttributes = $props();

  setFromContext(form.context);
</script>

<FormTag bind:ref {attributes}>
  <Content />
  <SubmitButton />
</FormTag>
