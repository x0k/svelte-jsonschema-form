<script lang="ts">
  import type { HTMLFormAttributes } from "svelte/elements";

  import Content from "./content.svelte";
  import { handlers } from "./create-form.svelte.js";
  import Root from "./root.svelte";
  import { type FormState, setFormContext } from "./state/index.js";
  import SubmitButton from "./submit-button.svelte";

  let {
    ref = $bindable(),
    form,
    ...attributes
  }: {
    form: FormState<any>;
    ref?: HTMLFormElement | undefined;
  } & HTMLFormAttributes = $props();

  // svelte-ignore state_referenced_locally
  setFormContext(form);
</script>

<form bind:this={ref} {@attach handlers(form)} {...attributes}>
  <Root>
    <Content />
    <SubmitButton />
  </Root>
</form>
