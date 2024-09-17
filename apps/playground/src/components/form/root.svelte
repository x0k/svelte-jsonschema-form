<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from "svelte/elements";

  import type { FieldProps } from './model';
  import type { FormComponentExports } from './components';
  import type { ComponentsResolver } from './resolver';

  import Field from './field.svelte';

  let form: FormComponentExports

  export function submit() {
    form.submitRequest();
  }

  export function reset() {
    form.reset();
  }

  interface Props extends FieldProps<T>, HTMLAttributes<HTMLFormElement> {
    componentsResolver: ComponentsResolver
    children?: Snippet
  }

  let {
    componentsResolver,
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

  const Form = $derived(componentsResolver({ type: "form", schema }))
</script>

<Form {...formProps} bind:this={form} onsubmit={handleSubmit}>
  <Field bind:value {schema} {disabled} {readonly} />
  {#if children}
    {@render children()}
  {:else}
    <button type="submit">Submit</button>
  {/if}
</Form>
