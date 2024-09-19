<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from "svelte/elements";

  import type { Schema, Validator } from './schema';
  import type { ComponentOptions, Components } from './component';
  import type { UiSchema } from './ui-schema';
  import type { Translator } from './translation';
  import { setFromContext } from './context.svelte';
  import { Field } from './field';
  import SubmitButton from './submit-button.svelte';

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
    components: Components
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

  setFromContext({
    get schema() {
      return schema
    },
    get uiSchema() {
      return uiSchema
    },
    get disabled() {
      return disabled
    },
    get readonly() {
      return readonly
    },
    get validator() {
      return validator
    },
    get components() {
      return components
    },
    get translator() {
      return translator
    }
  })

  const options: ComponentOptions = $derived({ schema, uiSchema })
  const Form = $derived(components("form", options))
</script>

<Form {...formProps} bind:form onsubmit={handleSubmit}>
  <Field bind:value {schema} {uiSchema} {disabled} {readonly} />
  {#if children}
    {@render children()}
  {:else}
    <SubmitButton />
  {/if}
</Form>
