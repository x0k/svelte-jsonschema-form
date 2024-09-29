<script lang="ts" generics="T">
  import { untrack, type Snippet } from 'svelte';
  import type { HTMLAttributes } from "svelte/elements";

  import type { Schema, SchemaValue, Validator } from './schema';
  import type { Components } from './component';
  import type { UiSchemaRoot } from './ui-schema';
  import type { Translation } from './translation';
  import type { Widgets } from './widgets';
  import { setFromContext, type FormContext } from './context';
  import { type Fields, fields as defaultFields, getField } from './fields';
  import { type Templates, templates as defaultTemplates } from './templates';
  import { getDefaultFormState, getUiOptions, retrieveSchema, toIdSchema } from './utils';
  import { getComponent } from './component'
  import SubmitButton from './submit-button.svelte';
  import type { Config } from './config';

  let form = $state<HTMLFormElement>()

  export function submit() {
    form?.requestSubmit()
  }

  export function reset() {
    form?.reset()
  }

  type Value = SchemaValue | undefined

  interface Props extends HTMLAttributes<HTMLFormElement> {
    schema: Schema
    validator: Validator<Value>
    components: Components
    widgets: Widgets
    translation: Translation
    value?: T
    uiSchema?: UiSchemaRoot
    fields?: Fields
    templates?: Templates
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
    templates = defaultTemplates,
    disabled = false,
    readonly = false,
    idPrefix = "root",
    idSeparator = "_",
    children,
    ...formProps
  }: Props = $props();

  $effect(() => {
    schema;
    untrack(() => {
      // TODO: Mutate `value` directly if it possible
      value = getDefaultFormState(ctx, schema, value as Value) as T
    })
  })

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    console.log(e);
  }

  const ctx: FormContext<Value> = {
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
    get templates() {
      return templates
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

  const retrievedSchema = $derived(retrieveSchema(ctx, schema, value as Value))
  const idSchema = $derived(toIdSchema(
    ctx,
    retrievedSchema,
    uiSchema['ui:rootFieldId'],
    value as Value
  ))

  const config: Config = $derived({
    name: "",
    schema: retrievedSchema,
    uiSchema,
    idSchema,
    uiOptions: getUiOptions(ctx, uiSchema),
    required: false,
  })

  const Form = $derived(getComponent(ctx, "form", config))
  const Field = $derived(getField(ctx, "root", config))
</script>

<Form bind:form {...formProps} onsubmit={handleSubmit} {config} >
  <Field bind:value={value as Value} {config} />
  {#if children}
    {@render children()}
  {:else}
    <SubmitButton />
  {/if}
</Form>
