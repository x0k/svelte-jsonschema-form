<script lang="ts">
  import type { HTMLFormAttributes } from "svelte/elements";

  import { setFromContext } from "./context/context.js";
  import type { FormElement as FormElementType } from "./component.js";
  import type { FormInternals } from "./create-form.svelte.js";
  import Content from "./content.svelte";
  import SubmitButton from "./submit-button.svelte";
  import FormElement from "./form-element.svelte";

  interface Props extends HTMLFormAttributes {
    ref?: FormElementType | undefined;
    form: FormInternals;
  }

  let { ref = $bindable(), form }: Props = $props();

  setFromContext(form.context);
</script>

<FormElement bind:ref>
  <Content />
  <SubmitButton />
</FormElement>
