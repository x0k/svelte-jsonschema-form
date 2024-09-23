<script lang="ts" generics="T extends SchemaValue">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from "svelte/elements";

  import type { Schema, SchemaValue, Validator } from './schema';
  import type { Components } from './component';
  import type { UiSchemaRoot } from './ui-schema';
  import type { Translation } from './translation';
  import type { Widgets } from './widgets';
  import { setFromContext, type FormContext } from './context';
  import { type Fields, fields as defaultFields } from './fields';
  import SubmitButton from './submit-button.svelte';
  import { getComponent, getDefaultFormState, getField, retrieveSchema, toIdSchema } from './utils';

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
    translation: Translation
    value?: T
    uiSchema?: UiSchemaRoot
    fields?: Fields
    disabled?: boolean
    readonly?: boolean
    idPrefix?: string
    idSeparator?: string
    children?: Snippet
  }

  let {
    components,
    schema,
    validator,
    translation,
    widgets,
    value = $bindable(),
    uiSchema = {},
    fields = defaultFields,
    disabled = false,
    readonly = false,
    idPrefix = "root",
    idSeparator = "_",
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
    get idPrefix() {
      return idPrefix
    },
    get idSeparator() {
      return idSeparator
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
    get translation() {
      return translation
    }
  }
  setFromContext(ctx)

  const Form = $derived(getComponent(ctx, "form", uiSchema))
  const Field = $derived(getField(ctx, "root", uiSchema))
  let formData = $state(getDefaultFormState(ctx, schema, value))
  $effect(() => {
    value = formData as T
  })
  const retrievedSchema = $derived(retrieveSchema<SchemaValue>(ctx, schema, formData))
  const idSchema = $derived(toIdSchema(
    ctx,
    retrievedSchema,
    uiSchema['ui:rootFieldId'],
    value
  ))
</script>

<Form bind:form {...formProps} onsubmit={handleSubmit} >
  <Field bind:value={formData} name="" required={false} {schema} {uiSchema} {idSchema} />
  {#if children}
    {@render children()}
  {:else}
    <SubmitButton />
  {/if}
</Form>
