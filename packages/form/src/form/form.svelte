<script lang="ts" module>
  import type { HTMLFormAttributes } from "svelte/elements";
  import type { Snippet } from 'svelte';

  import type { SchedulerYield } from '@/lib/scheduler.js';
  import type { Schema } from '@/core/index.js';

  import type { Translation } from './translation.js';
  import type { UiSchemaRoot } from './ui-schema.js';
  import type { Components } from './component.js';
  import type { Widgets } from './widgets.js';
  import type { Errors } from './errors.js'
  import type { Fields } from './fields/index.js';
  import type { Templates } from './templates/index.js';
  import type { InputsValidationMode } from './validation.js';
  import type { FormValidator } from './validator.js';

  export interface Props<T, E> extends HTMLFormAttributes {
    schema: Schema
    validator: FormValidator<E>
    components: Components
    widgets: Widgets
    translation: Translation
    form?: HTMLFormElement
    isSubmitted?: boolean
    value?: T
    uiSchema?: UiSchemaRoot
    fields?: Fields
    templates?: Templates
    inputsValidationMode?: InputsValidationMode,
    disabled?: boolean
    idPrefix?: string
    idSeparator?: string
    children?: Snippet
    errors?: Errors<E>
    onSubmit?: (value: T | undefined, e: SubmitEvent) => void
    onSubmitError?: (errors: Errors<E>, e: SubmitEvent) => void
    onReset?: (e: Event) => void
    schedulerYield?: SchedulerYield
  }
</script>

<script lang="ts" generics="T, E">
  import { untrack } from 'svelte';
  import { SvelteMap } from 'svelte/reactivity';

  import type { SchemaValue } from '@/core/index.js';

  import type { Config } from './config.js';
  import { NO_ERRORS } from './errors.js';
  import { setFromContext, type FormContext } from './context.js';
  import { fields as defaultFields, getField } from './fields/index.js';
  import { templates as defaultTemplates } from './templates/index.js';
  import { getDefaultFormState, getUiOptions, retrieveSchema, toIdSchema } from './utils.js';
  import { getComponent } from './component.js'
  import SubmitButton from './submit-button.svelte';
  import { DEFAULT_ID_PREFIX, DEFAULT_ID_SEPARATOR } from './id-schema.js';

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
    inputsValidationMode = 0,
    disabled = false,
    idPrefix = DEFAULT_ID_PREFIX,
    idSeparator = DEFAULT_ID_SEPARATOR,
    children,
    form = $bindable(),
    isSubmitted = $bindable(false),
    errors = $bindable(new SvelteMap()),
    onSubmit,
    onSubmitError,
    onReset = () => {
      isSubmitted = false
      errors.clear()
    },
    onsubmit,
    schedulerYield = typeof scheduler !== "undefined" && "yield" in scheduler
      ? scheduler.yield.bind(scheduler)
      : ({ signal }) => new Promise((resolve, reject) => {
          setTimeout(() => {
            if (signal.aborted) {
              reject(signal.reason)
            } else {
              resolve()
            }
          }, 0);
        }),
    ...attributes
  }: Props<T, E> = $props();

  $effect(() => {
    if (form === undefined) {
      return
    }
    form.addEventListener("reset", onReset)
    return () => {
      form?.removeEventListener("reset", onReset)
    }
  })

  type Value = SchemaValue | undefined

  $effect(() => {
    schema;
    untrack(() => {
      // TODO: Mutate `value` directly if it is possible
      value = getDefaultFormState(ctx, schema, value as Value) as T
    })
  })

  const ctx: FormContext = {
    get inputsValidationMode() {
      return inputsValidationMode
    },
    get isSubmitted() {
      return isSubmitted
    },
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
    },
    get schedulerYield() {
      return schedulerYield
    },
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
    const list = validator.validateFormData(schema, value as Value)
    return new SvelteMap(SvelteMap.groupBy(list, (error) => error.instanceId))
  }

  const submitHandler = $derived(onSubmit || onSubmitError ? (e: SubmitEvent) => {
    e.preventDefault();
    isSubmitted = true
    errors = validate();
    if (errors.size === 0) {
      onSubmit?.($state.snapshot(value) as T | undefined, e)
      return
    }
    onSubmitError?.(errors, e)
  } : onsubmit)
</script>

<Form bind:form {attributes} onsubmit={submitHandler} {config} errors={NO_ERRORS} >
  <Field bind:value={value as Value} {config} />
  {#if children}
    {@render children()}
  {:else}
    <SubmitButton />
  {/if}
</Form>
