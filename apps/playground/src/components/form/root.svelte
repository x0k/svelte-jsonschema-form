<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from "svelte/elements";

  import type { ComponentsResolver } from './resolver';
  import type { Schema, Validator } from './schema';
  import type { ComponentOptions } from './component';
  import type { UiSchema } from './ui-schema';
  import type { Translator } from './translation';
  import { Field, FieldUtils } from './field';
  import SubmitButton from './widgets/submit-button.svelte';

  let form = $state<HTMLFormElement>()

  export function submit() {
    const requestSubmit = form?.requestSubmit
    requestSubmit?.call(form)
  }

  export function reset() {
    const reset = form?.reset
    reset?.call(form)
  }

  interface Props extends HTMLAttributes<HTMLFormElement> {
    schema: Schema
    validator: Validator<T>
    components: ComponentsResolver
    translator: Translator
    value?: T
    uiSchema?: UiSchema
    disabled?: boolean
    readonly?: boolean
    children?: Snippet
  }

  let {
    components,
    schema,
    validator,
    translator,
    value = $bindable(),
    uiSchema = {},
    disabled = false,
    readonly = false,
    children,
    ...formProps
  }: Props = $props();

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    console.log(e);
  }

  const options: ComponentOptions = $derived({ schema, uiSchema })
  const Form = $derived(components("form", options))
  const Button = $derived(components("button", options))
  const utils = $derived(new FieldUtils(validator, schema))
</script>

<Form {...formProps} bind:form onsubmit={handleSubmit}>
  <Field bind:value {schema} {uiSchema} {utils} {disabled} {readonly} />
  {#if children}
    {@render children()}
  {:else}
    <SubmitButton {components} {translator} {schema} {uiSchema} />
  {/if}
</Form>
