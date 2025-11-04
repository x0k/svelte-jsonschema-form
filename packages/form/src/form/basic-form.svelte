<script lang="ts">
  import type { HTMLFormAttributes } from "svelte/elements";

  import { type FormState, setFormContext } from "./state/index.js";
  import Form from "./form.svelte";
  import Content from "./content.svelte";
  import SubmitButton from "./submit-button.svelte";

  let {
    ref = $bindable(),
    form,
    ...attributes
  }: {
    form: FormState<any>;
    ref?: HTMLFormElement | undefined;
  } & HTMLFormAttributes = $props();

  setFormContext(form);
</script>

<Form bind:ref {attributes}>
  <Content />
  <SubmitButton />
</Form>
