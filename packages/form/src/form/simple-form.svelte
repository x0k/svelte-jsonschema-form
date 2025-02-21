<script
  lang="ts"
  generics="A extends FormAttributes"
>
  import Content from "./content.svelte";
  import SubmitButton from "./submit-button.svelte";
  import Form from "./form.svelte";
  import type { FormElement, FormAttributes } from "./theme.js";

  let {
    ref = $bindable(),
    ...attributes
  }: {
    ref?: FormElement | undefined;
  } & A = $props();
</script>

<Form bind:ref {attributes}>
  <Content />
  <SubmitButton />
</Form>
