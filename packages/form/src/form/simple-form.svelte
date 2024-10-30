<script lang="ts" generics="T, E">
  import type { HTMLFormAttributes } from "svelte/elements";

  import type { FormAPI } from "./use-form.svelte.js";
  import FormContent from "./form-content.svelte";
  import SubmitButton from "./submit-button.svelte";

  interface Props extends HTMLFormAttributes {
    form: FormAPI<T, E>;
  }

  const { form, ...rest }: Props = $props();
</script>

<form use:form.enhance {...rest}>
  <!-- svelte-ignore ownership_invalid_binding -->
  <FormContent bind:value={form.formValue} />
  <SubmitButton />
</form>
