<script lang="ts">
  import type { HTMLFormAttributes } from "svelte/elements";
  import Content from "./content.svelte";
  import Form from "./form.svelte";
  import { type FormState, setFormContext } from "./state/index.js";
  import SubmitButton from "./submit-button.svelte";

  const {
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
