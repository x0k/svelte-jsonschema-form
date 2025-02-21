<script lang="ts" generics="A extends FormAttributes">
  import type { FormElement, FormAttributes } from "./theme.js";
  import type { FormInternals } from "./create-form.svelte.js";
  import { setFromContext } from "./context/context.js";
  import Content from "./content.svelte";
  import Form from "./form.svelte";
  import SubmitButton from "./submit-button.svelte";

  let {
    ref = $bindable(),
    form,
    ...attributes
  }: {
    ref?: FormElement | undefined;
    form: FormInternals<any, any>;
  } & A = $props();

  setFromContext(form.context);
</script>

<Form bind:ref {attributes}>
  <Content />
  <SubmitButton />
</Form>
