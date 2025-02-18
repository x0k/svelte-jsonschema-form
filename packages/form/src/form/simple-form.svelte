<script lang="ts">
  import Content from "./content.svelte";
  import SubmitButton from "./submit-button.svelte";
  import Form from "./form.svelte";
  import type { FormElement, FormAttributes } from "./theme.js";

  let {
    ref = $bindable(),
    attributes,
  }: {
    ref?: FormElement | undefined;
    attributes?: FormAttributes;
  } = $props();
</script>

<Form bind:ref {attributes}>
  <Content />
  <SubmitButton />
</Form>
