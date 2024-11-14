<script lang="ts" generics="T, E">
  import type { HTMLFormAttributes } from "svelte/elements";
  import { FormContent, setFromContext, SubmitButton, type FormAPI, type FormContext } from '@sjsf/form';

  interface Props extends HTMLFormAttributes {
    form: FormAPI<T, E>;
    ctx: FormContext;
  }

  const { form, ctx, ...rest }: Props = $props();

  setFromContext(ctx)
</script>

<form use:form.enhance {...rest}>
  <!-- svelte-ignore ownership_invalid_binding -->
  <FormContent bind:value={form.formValue} />
  <SubmitButton />
</form>
