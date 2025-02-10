<script lang="ts">
  import { setFromContext, type FormContext } from "./context/context.js";
  import Content from "./content.svelte";
  import SubmitButton from "./submit-button.svelte";
  import FormElementComponent from "./form-element.svelte";
  import type { FormElement, FormElementProps } from "./theme.js";

  interface Props {
    ref?: FormElement | undefined;
    attributes?: FormElementProps | undefined;
    context: FormContext;
  }

  let { ref = $bindable(), context, attributes }: Props = $props();

  setFromContext(context);
</script>

<FormElementComponent bind:ref {attributes}>
  <Content />
  <SubmitButton />
</FormElementComponent>
