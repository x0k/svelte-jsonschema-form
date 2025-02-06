<script lang="ts">
  import type { HTMLFormAttributes } from "svelte/elements";

  import { setFromContext } from "./context/context.js";
  import type { FormInternals } from "./create-form.svelte.js";
  import Content from "./content.svelte";
  import SubmitButton from "./submit-button.svelte";
  import FormElement from "./form-element.svelte";

  interface Props extends HTMLFormAttributes {
    form: FormInternals;
  }

  const { form, ...rest }: Props = $props();

  setFromContext(form.context);
</script>

<FormElement>
  <Content {form} />
  <SubmitButton />
</FormElement>
