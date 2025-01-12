<script lang="ts" generics="T, E">
  import type { HTMLFormAttributes } from "svelte/elements";

  import type { FormInternals } from "./create-form.svelte.js";
  import FormContent from "./form-content.svelte";
  import SubmitButton from "./submit-button.svelte";
  import { setFromContext } from './context/context.js';

  interface Props extends HTMLFormAttributes {
    form: FormInternals
  }

  const { form, ...rest }: Props = $props();

  setFromContext(form.context);
</script>

<form use:form.enhance {...rest}>
  <!-- svelte-ignore ownership_invalid_binding -->
  <FormContent bind:value={form.formValue} />
  <SubmitButton />
</form>
