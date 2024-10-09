<script lang="ts" generics="T, E">
  import { untrack, type Snippet } from 'svelte';
  import type { HTMLFormAttributes } from "svelte/elements";

  import type { Config } from '@/core/config.js';
  import type { Translation } from '@/core/translation.js';
  import type { UiSchemaRoot } from '@/core/ui-schema.js';
  import { type Schema, type SchemaValue, type Validator, type ValidatorError, ValidatorErrorType } from '@/core/schema/index.js';
  
  import type { Components } from './component.js';
  import type { Widgets } from './widgets.js';
  import { setFromContext, type FormContext } from './context.js';
  import { type Fields, fields as defaultFields, getField } from './fields/index.js';
  import { type Templates, templates as defaultTemplates } from './templates/index.js';
  import { getDefaultFormState, getUiOptions, NO_ERRORS, retrieveSchema, toIdSchema } from './utils.js';
  import { getComponent } from './component.js'
  import SubmitButton from './submit-button.svelte';

  let form = $state<HTMLFormElement>()

  export function submit() {
    form?.requestSubmit()
  }

  export function reset() {
    form?.reset()
  }

  export function resetErrors() {
    errors = [];
  }

  type Value = SchemaValue | undefined

  interface Props extends HTMLFormAttributes {
    schema: Schema
    validator: Validator<E>
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
    errors?: ValidatorError<unknown>[]
    onSubmit?: (value: T | undefined, e: SubmitEvent) => void
    onSubmitError?: (errors: ValidatorError<unknown>[], e: SubmitEvent) => void
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
    errors = $bindable([]),
    onSubmit,
    onSubmitError,
    ...attributes
  }: Props = $props();

  $effect(() => {
    schema;
    untrack(() => {
      // TODO: Mutate `value` directly if it possible
      value = getDefaultFormState(ctx, schema, value as Value) as T
    })
  })

  let validationErrors = $derived(Map.groupBy(errors.filter(e => e.type === ValidatorErrorType.ValidationError), (e) => e.instanceId))

  const ctx: FormContext = {
    get validationErrors() {
      return validationErrors
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

  export function validate() {
    return validator.validateFormData(schema, value as Value)
  }

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    errors = validate();
    if (errors.length === 0) {
      onSubmit?.($state.snapshot(value) as T | undefined, e)
      return
    }
    onSubmitError?.(errors, e)
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
