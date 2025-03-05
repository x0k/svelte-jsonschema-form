<script lang="ts">
  import type { HTMLFormAttributes } from "svelte/elements";

  import type { FormState } from "./form.svelte.js";
  import { setFromContext } from "./context/context.js";
  import Content from "./content.svelte";
  import FormTag from "./form-tag.svelte";
  import SubmitButton from "./submit-button.svelte";

  let {
    ref = $bindable(),
    form,
    ...attributes
  }: {
    form: Pick<FormState<any, any>, "internals">;
    ref?: HTMLFormElement | undefined;
  } & HTMLFormAttributes = $props();

  setFromContext(form.internals);
</script>

<FormTag bind:ref {attributes}>
  <Content />
  <SubmitButton />
</FormTag>
