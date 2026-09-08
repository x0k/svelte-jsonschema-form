<script lang="ts">
  import type { HTMLFormAttributes } from "svelte/elements";

  import Content from "./content.svelte";
  import Root from "./root.svelte";
  import {
    type FormState,
    reset,
    setFormContext,
    validate,
  } from "./state/index.js";
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

<form
  bind:this={ref}
  onsubmit={(e) => {
    e.preventDefault();
    void validate(form);
  }}
  onreset={(e) => {
    e.preventDefault();
    reset(form);
  }}
  {...attributes}
>
  <Root>
    <Content />
    <SubmitButton />
  </Root>
</form>
