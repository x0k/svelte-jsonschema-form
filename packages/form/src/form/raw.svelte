<script lang="ts">
  import type { HTMLFormAttributes } from "svelte/elements";

  import { setFromContext } from "./context/context.js";
  import type { FormInternals } from "./create-form.svelte.js";
  import FormContent from "./content.svelte";
  import SubmitButton from "./submit-button.svelte";
  import FormElement from "./form-element.svelte";

  interface Props extends HTMLFormAttributes {
    form: FormInternals;
  }

  const { form, ...rest }: Props = $props();

  setFromContext(form.context);
</script>

<!-- @deprecated -->
<!-- TODO: after `attach` release, use it here -->
<FormElement
  onsubmit={form.submitHandler}
  onreset={form.resetHandler}
  {...rest}
>
  <!-- svelte-ignore ownership_invalid_binding -->
  <FormContent bind:value={form.formValue} />
  <SubmitButton />
</FormElement>
