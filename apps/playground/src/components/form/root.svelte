<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from "svelte/elements";

  import type { ComponentsResolver } from './resolver';
  import type { Schema, Validator } from './schema';
  import { Field, FieldUtils } from './field';

  let form = $state<HTMLFormElement>()

  export function submit() {
    const requestSubmit = form?.requestSubmit
    requestSubmit?.call(form)
  }

  export function reset() {
    const reset =form?.reset
    reset?.call(form)
  }

  interface Props extends HTMLAttributes<HTMLFormElement> {
    schema: Schema
    validator: Validator<T>
    disabled?: boolean
    readonly?: boolean
    value?: T
    componentsResolver: ComponentsResolver
    children?: Snippet
  }

  let {
    componentsResolver,
    schema,
    validator,
    value = $bindable(),
    disabled = false,
    readonly = false,
    children,
    ...formProps
  }: Props = $props();

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    console.log(e);
  }

  const Form = $derived(componentsResolver({ type: "form", schema }))
  const utils = $derived(new FieldUtils(validator, schema))
</script>

<Form {...formProps} bind:form onsubmit={handleSubmit}>
  <Field bind:value {schema} {utils} {disabled} {readonly} />
  {#if children}
    {@render children()}
  {:else}
    <button type="submit">Submit</button>
  {/if}
</Form>
<button onclick={submit}>
  Trigger submit
</button>
