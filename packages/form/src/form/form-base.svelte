<!--
    @component
    @deprecated use `useForm` API
-->
<script lang="ts" module>
  import type { HTMLFormAttributes } from "svelte/elements";
  import type { Snippet } from 'svelte';

  import type { SchedulerYield } from '@/lib/scheduler.js';
  import type { Schema, SchemaValue } from '@/core/index.js';

  import type { Label, Labels, Translation } from './translation.js';
  import type { UiSchemaRoot } from './ui-schema.js';
  import type { Components } from './component.js';
  import type { Widgets } from './widgets.js';
  import type { Errors } from './errors.js'
  import type { Fields } from './fields/index.js';
  import type { Templates } from './templates/index.js';
  import type { InputsValidationMode } from './validation.js';
  import type { FormValidator } from './validator.js';
  import type { FormMerger } from './merger.js';
  import type { Icons } from './icons.js';

  export interface Props<T, E> extends HTMLFormAttributes {
    schema: Schema
    validator: FormValidator<E>
    components: Components
    widgets: Widgets
    translation: Translation
    merger?: FormMerger
    form?: HTMLFormElement
    isSubmitted?: boolean
    value?: T
    uiSchema?: UiSchemaRoot
    fields?: Fields
    templates?: Templates
    icons?: Icons
    inputsValidationMode?: InputsValidationMode,
    disabled?: boolean
    idPrefix?: string
    idSeparator?: string
    children?: Snippet
    errors?: Errors<E>
    /**
     * The function to get the form data snapshot
     * 
     * The snapshot is used to validate the form and passed to
     * `onSubmit` and `onSubmitError` handlers. 
     * 
     * @default () => $state.snapshot(value)
     */
    getSnapshot?: () => SchemaValue | undefined
    /**
     * Submit handler
     * 
     * Will be called when the form is submitted and form data
     * snapshot is valid
     */
    onSubmit?: (value: T | undefined, e: SubmitEvent) => void
    /**
     * Submit error handler
     * 
     * Will be called when the form is submitted and form data
     * snapshot is not valid
     */
    onSubmitError?: (errors: Errors<E>, e: SubmitEvent, snapshot: SchemaValue | undefined) => void
    /**
     * Reset handler
     * 
     * Will be called on form reset.
     * 
     * By default it will clear the errors and set `isSubmitted` state to `false`.
     * 
     * @default () => { isSubmitted = false; errors.clear() }
     */
    onReset?: (e: Event) => void
    schedulerYield?: SchedulerYield
  }
</script>

<script lang="ts" generics="T, E">
  import { SvelteMap } from 'svelte/reactivity';

  import type { Config } from './config.js';
  import { NO_ERRORS } from './errors.js';
  import {
    getComponent,
    getField,
    setFromContext,
    type FormContext,
    getUiOptions,
    retrieveSchema,
    makeIdSchema,
  } from './context/index.js';
  import { fields as defaultFields } from './fields/index.js';
  import { templates as defaultTemplates } from './templates/index.js';
  import { DEFAULT_ID_PREFIX, DEFAULT_ID_SEPARATOR } from './id-schema.js';
  import { DefaultFormMerger } from './merger.js'
  import SubmitButton from './submit-button.svelte';

  let {
    value = $bindable(),
    form = $bindable(),
    isSubmitted = $bindable(false),
    errors = $bindable(new SvelteMap()),
    //
    components,
    schema,
    validator,
    translation,
    widgets,
    uiSchema = {},
    fields = defaultFields,
    templates = defaultTemplates,
    icons = {},
    inputsValidationMode = 0,
    disabled = false,
    idPrefix = DEFAULT_ID_PREFIX,
    idSeparator = DEFAULT_ID_SEPARATOR,
    merger,
    children,
    onsubmit,
    onSubmit,
    onSubmitError,
    onReset = () => {
      isSubmitted = false
      errors.clear()
    },
    getSnapshot = () => $state.snapshot(value) as SchemaValue | undefined,
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

  const reactiveMerger = $derived(merger ?? new DefaultFormMerger(validator, schema));

  type Value = SchemaValue | undefined

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
    get merger() {
      return reactiveMerger
    },
    get icons() {
      return icons
    },
    get schedulerYield() {
      return schedulerYield
    },    
    get iconOrTranslation() {
      return iconOrTranslation
    }
  }
  setFromContext(ctx)

  const retrievedSchema = $derived(retrieveSchema(ctx, schema, value as Value))
  const idSchema = $derived(makeIdSchema(
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

  function validateSnapshot(snapshot: SchemaValue | undefined) {
    const list = validator.validateFormData(schema, snapshot)
    return new SvelteMap(SvelteMap.groupBy(list, (error) => error.instanceId))
  }

  export function validate() {
    return validateSnapshot(getSnapshot())
  }

  const submitHandler = $derived(onSubmit || onSubmitError ? (e: SubmitEvent) => {
    e.preventDefault();
    isSubmitted = true
    const snapshot = getSnapshot()
    errors = validateSnapshot(snapshot);
    if (errors.size === 0) {
      onSubmit?.(snapshot as T | undefined, e)
      return
    }
    onSubmitError?.(errors, e, snapshot)
  } : onsubmit)
</script>

{#snippet iconOrTranslation(params: {
  [L in Label]: [L, ...Labels[L]]
}[Label])}
  {@const icon = icons[params[0]]}
  {#if icon}
    {@render icon(params as never)}
  {:else}
    {translation.apply(null, params)}
  {/if}
{/snippet}

<Form bind:form {attributes} onsubmit={submitHandler} {config} errors={NO_ERRORS} >
  <Field bind:value={value as Value} {config} />
  {#if children}
    {@render children()}
  {:else}
    <SubmitButton />
  {/if}
</Form>
