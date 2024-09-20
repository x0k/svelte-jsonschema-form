<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from "svelte/elements";

  import type { Schema, Validator } from './schema';
  import type { Components } from './component';
  import type { UiSchemaRoot } from './ui-schema';
  import type { Translator } from './translation';
  import type { Widgets } from './widgets';
  import { setFromContext, type FormContext } from './context';
  import { type Fields, fields as defaultFields } from './fields';
  import SubmitButton from './submit-button.svelte';
  import { getComponent, getField } from './utils';

  let form = $state<HTMLFormElement>()

  export function submit() {
    form?.requestSubmit()
  }

  export function reset() {
    form?.reset()
  }

  interface Props extends HTMLAttributes<HTMLFormElement> {
    schema: Schema
    validator: Validator<T>
    components: Components
    widgets: Widgets
    translator: Translator
    value?: T
    uiSchema?: UiSchemaRoot
    fields?: Fields
    disabled?: boolean
    readonly?: boolean
    children?: Snippet
  }

  let {
    components,
    schema,
    validator,
    translator,
    widgets,
    value = $bindable(),
    uiSchema = {},
    fields = defaultFields,
    disabled = false,
    readonly = false,
    children,
    ...formProps
  }: Props = $props();

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    console.log(e);
  }

  const ctx: FormContext<T> = {
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
    get fields() {
      return fields
    },
    get components() {
      return components
    },
    get widgets() {
      return widgets
    },
    get translator() {
      return translator
    }
  }
  setFromContext(ctx)

  const Form = $derived(getComponent(ctx, "form", uiSchema))
  const Field = $derived(getField(ctx, "root", uiSchema))
</script>

<Form {...formProps} bind:form onsubmit={handleSubmit}>
  <Field bind:value {schema} {uiSchema} />
  {#if children}
    {@render children()}
  {:else}
    <SubmitButton />
  {/if}
</Form>
