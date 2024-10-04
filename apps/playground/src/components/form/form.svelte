<script lang="ts" generics="T, E">
  import { untrack, type Snippet } from 'svelte';
  import type { HTMLFormAttributes } from "svelte/elements";

  import { type Schema, type SchemaValue, type Validator } from './schema';
  import type { Components } from './component';
  import type { UiSchemaRoot } from './ui-schema';
  import type { Translation } from './translation';
  import type { Widgets } from './widgets';
  import { setFromContext, type FormContext } from './context';
  import { type Fields, fields as defaultFields, getField } from './fields';
  import { type Templates, templates as defaultTemplates } from './templates';
  import { getDefaultFormState, getUiOptions, NO_ERRORS, retrieveSchema, toIdSchema } from './utils';
  import { getComponent } from './component'
  import SubmitButton from './submit-button.svelte';
  import type { Config } from './config';
  import { ValidatorErrorType, type DataValidator, type ValidationError, type ValidatorError } from './data-validator';

  let form = $state<HTMLFormElement>()

  export function submit() {
    form?.requestSubmit()
  }

  export function reset() {
    form?.reset()
  }

  type Value = SchemaValue | undefined

  interface Props extends HTMLFormAttributes {
    schema: Schema
    validator: Validator & DataValidator<E>
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
    onErrors?: (errors: ValidatorError<E>[]) => void
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
    onErrors,
    ...attributes
  }: Props = $props();

  $effect(() => {
    schema;
    untrack(() => {
      // TODO: Mutate `value` directly if it possible
      value = getDefaultFormState(ctx, schema, value as Value) as T
    })
  })

  let errors = $state.raw<Map<string, ValidationError<E>[]>>(new Map())

  const ctx: FormContext = {
    get errors() {
      return errors
    },
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
  const uiOptions = $derived(getUiOptions(ctx, uiSchema))
  const config: Config = $derived({
    name: "",
    title: uiOptions?.title ?? schema.title ?? "",
    schema: retrievedSchema,
    uiSchema,
    idSchema,
    uiOptions,
    required: false,
  })

  const Form = $derived(getComponent(ctx, "form", config))
  const Field = $derived(getField(ctx, "root", config))

  function isValid() {
    const allErrors = validator.validateFormData(ctx, schema, value as Value)
    errors = Map.groupBy(allErrors.filter(e => e.type === ValidatorErrorType.ValidationError), (e) => e.instanceId)
    onErrors?.(allErrors)
    return allErrors.length === 0
  }

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    if (!isValid()) {
      return
    }

    console.log(e);
  }
</script>

<Form bind:form {attributes} onsubmit={handleSubmit} {config} errors={NO_ERRORS} >
  <Field bind:value={value as Value} {config} />
  {#if children}
    {@render children()}
  {:else}
    <SubmitButton />
  {/if}
</Form>
