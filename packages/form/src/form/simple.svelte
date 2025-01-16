<!--
    @component
    @deprecated use `RawForm` instead
-->
<script lang="ts" generics="T, E">
  import type { HTMLFormAttributes } from "svelte/elements";

  import { setFromContext } from "./context/context.js";
  import type { FormInternals } from "./create-form.svelte.js";
  import FormContent from "./content.svelte";
  import SubmitButton from "./submit-button.svelte";

  interface Props extends HTMLFormAttributes {
    form: FormInternals;
  }

  const { form, ...rest }: Props = $props();

  setFromContext(form.context);
</script>

<form use:form.enhance {...rest}>
  <!-- svelte-ignore ownership_invalid_binding -->
  <FormContent bind:value={form.formValue} />
  <SubmitButton />
</form>
