<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from "svelte/elements";

  import type { FieldProps } from './model';
  import Field from './field.svelte';

  let form: HTMLFormElement;

  export function submit() {
    form.requestSubmit();
  }

  export function reset() {
    form.reset();
  }

  interface Props extends FieldProps<T>, HTMLAttributes<HTMLFormElement> {
    children?: Snippet
  }

  let {
    value = $bindable(),
    schema,
    disabled,
    readonly,
    children,
    ...formProps
  }: Props = $props();

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
  }
</script>

<form {...formProps} onsubmit={handleSubmit} bind:this={form}>
  <Field bind:value {schema} {disabled} {readonly} />
  {#if children}
    {@render children()}
  {:else}
    <button type="submit">Submit</button>
  {/if}
</form>
