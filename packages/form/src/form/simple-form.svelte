<script lang="ts">
  import Content from "./content.svelte";
  import SubmitButton from "./submit-button.svelte";
  import Form from "./form.svelte";
  import type { FormElement, FormAttributes } from "./theme.js";

  interface Props extends FormAttributes {
    ref?: FormElement | undefined;
  }

  let { ref = $bindable(), ...attributes }: Props = $props();
</script>

<Form bind:ref {attributes}>
  <Content />
  <SubmitButton />
</Form>
