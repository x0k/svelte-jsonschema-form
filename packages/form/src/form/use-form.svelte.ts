import type { ComponentInternals, Snippet } from "svelte";
import type { Action } from "svelte/action";
import { SvelteMap } from "svelte/reactivity";

import type { SchedulerYield } from "@/lib/scheduler.js";
import type { Schema, SchemaValue } from "@/core/schema.js";
import {
  abortPrevious,
  debounce,
  useMutation,
  type FailedMutation,
  type Mutation,
  type MutationsCombinator2,
} from "@/use-mutation.svelte.js";

import {
  ADDITIONAL_PROPERTY_KEY_ERROR,
  VALIDATION_PROCESS_ERROR,
  type AdditionalPropertyKeyError,
  type AdditionalPropertyKeyValidator,
  type FormValidator2,
  type ValidationError,
  type ValidationProcessError,
} from "./validator.js";
import type { Components } from "./component.js";
import type { Widgets } from "./widgets.js";
import type { Translation } from "./translation.js";
import type { UiSchemaRoot } from "./ui-schema.js";
import type { Fields } from "./fields/index.js";
import type { Templates } from "./templates/index.js";
import type { Icons } from "./icons.js";
import type { InputsValidationMode } from "./validation.js";
import { groupErrors, type Errors, type FieldErrors } from "./errors.js";
import {
  setFromContext,
  type FormContext,
  type IconOrTranslationData,
} from "./context/index.js";
import { DefaultFormMerger, type FormMerger } from "./merger.js";
import { fields as defaultFields } from "./fields/index.js";
import { templates as defaultTemplates } from "./templates/index.js";
import {
  DEFAULT_ID_PREFIX,
  DEFAULT_ID_SEPARATOR,
  DEFAULT_PSEUDO_ID_SEPARATOR,
  pathToId,
} from "./id-schema.js";
import IconOrTranslation from "./icon-or-translation.svelte";
import type { Config } from "./config.js";
import { createAdditionalPropertyKeyValidationSchema } from "./additional-property-key-validation-schema.js";

export const DEFAULT_FIELD_VALIDATION_DEBOUNCE_MS = 300;

/**
 * @deprecated use `UseFormOptions2`
 */
export interface UseFormOptions<T, E> {
  validator: FormValidator2<E>;
  schema: Schema;
  components: Components;
  translation: Translation;
  widgets: Widgets;
  uiSchema?: UiSchemaRoot;
  merger?: FormMerger;
  fields?: Fields;
  templates?: Templates;
  icons?: Icons;
  inputsValidationMode?: InputsValidationMode;
  disabled?: boolean;
  idPrefix?: string;
  idSeparator?: string;
  pseudoIdSeparator?: string;
  //
  initialValue?: T;
  initialErrors?:
    | Errors<E>
    | Map<string, FieldErrors<E>>
    | ValidationError<E>[];
  /**
   * @default ignoreNewUntilPreviousIsFinished
   */
  validationCombinator?: MutationsCombinator2<unknown, [SubmitEvent]>;
  /**
   * @default 500
   */
  validationDelayedMs?: number;
  /**
   * @default 8000
   */
  validationTimeoutMs?: number;
  /**
   * @default 300
   */
  fieldValidationDebounceMs?: number;
  /**
   * @default debounce(abortPrevious, fieldValidationDebounceMs)
   */
  fieldValidationCombinator?: MutationsCombinator2<
    unknown,
    [Config<unknown>, SchemaValue | undefined]
  >;
  /**
   * @default 500
   */
  fieldValidationDelayedMs?: number;
  /**
   * @default 8000
   */
  fieldValidationTimeoutMs?: number;
  /**
   * The function to get the form data snapshot
   *
   * The snapshot is used to validate the form and passed to
   * `onSubmit` and `onSubmitError` handlers.
   *
   * @default () => $state.snapshot(formValue)
   */
  getSnapshot?: () => SchemaValue | undefined;
  /**
   * Submit handler
   *
   * Will be called when the form is submitted and form data
   * snapshot is valid
   *
   * Note that we rely on `validator.validateFormData` to check that the
   * `formData is T`. So make sure you provide a `T` type that
   * matches the validator check result.
   */
  onSubmit?: (value: T, e: SubmitEvent) => void;
  /**
   * Submit error handler
   *
   * Will be called when the form is submitted and form data
   * snapshot is not valid
   */
  onSubmitError?: (
    errors: Errors<E>,
    e: SubmitEvent,
    snapshot: SchemaValue | undefined
  ) => void;
  /**
   * Form validation error handler
   *
   * Will be called when the validation fails by a different reasons:
   * - error during validation
   * - validation is cancelled
   * - validation timeout
   */
  onValidationFailure?: (
    state: FailedMutation<unknown>,
    e: SubmitEvent
  ) => void;
  /**
   * Field validation error handler
   */
  onFieldValidationFailure?: (
    state: FailedMutation<unknown>,
    config: Config,
    value: SchemaValue | undefined
  ) => void;
  /**
   * Reset handler
   *
   * Will be called on form reset.
   *
   * By default it will clear the errors, set `isSubmitted` and `isChanged` state
   * to `false` and reset the form `value` to the `initialValue`.
   *
   * @default (e) => { e.preventDefault(); reset(); }
   */
  onReset?: (e: Event) => void;
  schedulerYield?: SchedulerYield;
}

export type ValidationProcessErrorTranslation = (
  state: FailedMutation<unknown>
) => string;

export interface UseFormOptions2<T, E> extends UseFormOptions<T, E> {
  additionalPropertyKeyValidator?: AdditionalPropertyKeyValidator;
  // @deprecated
  // TODO: Move translation functionality to `Translation`
  // and always add `ValidationProcessError` to the errors type
  // so this can be removed
  handleValidationProcessError?: ValidationProcessErrorTranslation;
}

export interface FormState<T, E> {
  value: T | undefined;
  formValue: SchemaValue | undefined;
  errors: Errors<E>;
  isSubmitted: boolean;
  isChanged: boolean;
  validation: Mutation<
    [event: SubmitEvent],
    {
      snapshot: SchemaValue | undefined;
      validationErrors: Errors<E>;
    },
    unknown
  >;
  fieldValidation: Mutation<
    [config: Config<unknown>, value: SchemaValue | undefined],
    ValidationError<E>[],
    unknown
  >;
  validate(): Errors<E>;
  validateAsync(signal: AbortSignal): Promise<Errors<E>>;
  submit(e: SubmitEvent): void;
  reset(): void;
  updateErrorsByPath(
    path: Array<string | number>,
    update: (errors: FieldErrors<E>) => Omit<ValidationError<E>, "instanceId">[]
  ): void;
}

export interface FormAPI<T, E> extends FormState<T, E> {
  enhance: Action;
}

type Value = SchemaValue | undefined;

/**
 * @deprecated use `createForm2`
 */
export function createForm<T, E>(
  options: UseFormOptions<T, E>
): [FormContext, FormAPI<T, E>] {
  const [api, ctx] = createForm2(options);
  return [ctx, api];
}

type FormValueFromOptions<O extends UseFormOptions2<any, any>> =
  O extends UseFormOptions2<infer T, any> ? T : never;

type ValidatorErrorFromOptions<O extends UseFormOptions2<any, any>> =
  O extends UseFormOptions2<any, infer E> ? E : never;

export type FormApiAndContext<T, E> = [FormAPI<T, E>, FormContext];

export function createForm2<
  O extends UseFormOptions2<any, any>,
  T = FormValueFromOptions<O>,
  VE = ValidatorErrorFromOptions<O>,
  E1 = O extends {
    additionalPropertyKeyValidator: AdditionalPropertyKeyValidator;
  }
    ? VE | AdditionalPropertyKeyError
    : VE,
  E = O extends {
    handleValidationProcessError: ValidationProcessErrorTranslation;
  }
    ? E1 | ValidationProcessError
    : E1,
>(options: O): FormApiAndContext<T, E> {
  const merger = $derived(
    options.merger ?? new DefaultFormMerger(options.validator, options.schema)
  );

  let value = $state(
    merger.mergeFormDataAndSchemaDefaults(
      options.initialValue as Value,
      options.schema
    )
  );
  let errors: Errors<E> = $state(
    Array.isArray(options.initialErrors)
      ? groupErrors(options.initialErrors)
      : new SvelteMap(options.initialErrors)
  );
  let isSubmitted = $state(false);
  let isChanged = $state(false);

  const inputsValidationMode = $derived(options.inputsValidationMode ?? 0);
  const uiSchema = $derived(options.uiSchema ?? {});
  const disabled = $derived(options.disabled ?? false);
  const idPrefix = $derived(options.idPrefix ?? DEFAULT_ID_PREFIX);
  const idSeparator = $derived(options.idSeparator ?? DEFAULT_ID_SEPARATOR);
  const pseudoIdSeparator = $derived(
    options.pseudoIdSeparator ?? DEFAULT_PSEUDO_ID_SEPARATOR
  );
  const fields = $derived(options.fields ?? defaultFields);
  const templates = $derived(options.templates ?? defaultTemplates);
  const icons = $derived(options.icons ?? {});
  const schedulerYield: SchedulerYield = $derived(
    (options.schedulerYield ??
      (typeof scheduler !== "undefined" && "yield" in scheduler))
      ? scheduler.yield.bind(scheduler)
      : ({ signal }: Parameters<SchedulerYield>[0]) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              if (signal.aborted) {
                reject(signal.reason);
              } else {
                resolve();
              }
            }, 0);
          })
  );
  const additionalPropertyKeyValidator = $derived.by(() => {
    const validator = options.additionalPropertyKeyValidator;
    return validator
      ? (config: Config, key: string) => {
          const instanceId = config.idSchema.$id;
          const messages = validator.validateAdditionalPropertyKey(key);
          errors.set(
            instanceId,
            messages.map((message) => ({
              instanceId,
              propertyTitle: config.title,
              message,
              error: ADDITIONAL_PROPERTY_KEY_ERROR as E,
            }))
          );
          return messages.length === 0;
        }
      : () => true;
  });

  const getSnapshot = $derived(
    options.getSnapshot ?? (() => $state.snapshot(value))
  );

  const validationSchema = $derived(
    options.additionalPropertyKeyValidator
      ? createAdditionalPropertyKeyValidationSchema(options.schema, [
          idSeparator,
          pseudoIdSeparator,
        ])
      : options.schema
  );

  function validateSnapshot(
    snapshot: SchemaValue | undefined,
    signal: AbortSignal
  ) {
    const errors = options.validator.validateFormData(
      validationSchema,
      snapshot,
      signal
    );
    if (errors instanceof Promise) {
      return errors.then(groupErrors);
    }
    return groupErrors(errors);
  }

  const validation = useMutation({
    async mutate(signal, _event: SubmitEvent) {
      isSubmitted = true;
      const snapshot = getSnapshot();
      const validationErrors = await validateSnapshot(snapshot, signal);
      return {
        snapshot,
        validationErrors,
      };
    },
    onSuccess({ snapshot, validationErrors }, event) {
      errors = validationErrors;
      if (errors.size === 0) {
        options.onSubmit?.(snapshot as T, event);
        isChanged = false;
        return;
      }
      options.onSubmitError?.(errors, event, snapshot);
    },
    onFailure(state, e) {
      if (options.handleValidationProcessError) {
        const error: ValidationProcessError = {
          type: VALIDATION_PROCESS_ERROR,
          state,
        };
        errors.set(idPrefix, [
          {
            instanceId: idPrefix,
            propertyTitle: "",
            message: options.handleValidationProcessError(state),
            error: error as E,
          },
        ]);
      }
      options.onValidationFailure?.(state, e);
    },
    get combinator() {
      return options.validationCombinator;
    },
    get delayedMs() {
      return options.validationDelayedMs;
    },
    get timeoutMs() {
      return options.validationTimeoutMs;
    },
  });

  const fieldValidation = useMutation({
    async mutate(signal, config: Config, value: SchemaValue | undefined) {
      return options.validator.validateFieldData(config, value, signal);
    },
    onSuccess(validationErrors: ValidationError<E>[], config) {
      if (validationErrors.length > 0) {
        errors.set(config.idSchema.$id, validationErrors);
      } else {
        errors.delete(config.idSchema.$id);
      }
    },
    onFailure(state, config, value) {
      if (options.handleValidationProcessError && state.reason !== "aborted") {
        const error: ValidationProcessError = {
          type: VALIDATION_PROCESS_ERROR,
          state,
        };
        errors.set(config.idSchema.$id, [
          {
            instanceId: config.idSchema.$id,
            propertyTitle: config.title,
            message: options.handleValidationProcessError(state),
            error: error as E,
          },
        ]);
      }
      options.onFieldValidationFailure?.(state, config, value);
    },
    get combinator() {
      return (
        options.fieldValidationCombinator ??
        debounce(
          abortPrevious,
          options.fieldValidationDebounceMs ??
            DEFAULT_FIELD_VALIDATION_DEBOUNCE_MS
        )
      );
    },
    get delayedMs() {
      return options.fieldValidationDelayedMs;
    },
    get timeoutMs() {
      return options.fieldValidationTimeoutMs;
    },
  });

  function submitHandler(e: SubmitEvent) {
    e.preventDefault();
    validation.run(e);
  }

  function reset() {
    isSubmitted = false;
    isChanged = false;
    errors.clear();
    value = merger.mergeFormDataAndSchemaDefaults(
      options.initialValue as Value,
      options.schema
    );
  }

  // @deprecated
  // TODO: Call `options.onReset` inside `reset` instead of overwriting it
  const resetHandler = $derived(
    options.onReset ??
      ((e: Event) => {
        e.preventDefault();
        reset();
      })
  );

  const fakeAbortSignal = new AbortController().signal;

  return [
    {
      get value() {
        return getSnapshot() as T | undefined;
      },
      set value(v) {
        value = merger.mergeFormDataAndSchemaDefaults(
          v as Value,
          options.schema
        );
      },
      get formValue() {
        return value;
      },
      set formValue(v) {
        value = v;
      },
      get errors() {
        return errors;
      },
      set errors(v) {
        errors = v;
      },
      get isSubmitted() {
        return isSubmitted;
      },
      set isSubmitted(v) {
        isSubmitted = v;
      },
      get isChanged() {
        return isChanged;
      },
      set isChanged(v) {
        isChanged = v;
      },
      validation,
      fieldValidation,
      validate() {
        const errors = validateSnapshot(getSnapshot(), fakeAbortSignal);
        if (errors instanceof Promise) {
          throw new Error("`validate` cannot be called with async validator");
        }
        return errors;
      },
      async validateAsync(signal: AbortSignal) {
        return validateSnapshot(getSnapshot(), signal);
      },
      submit(e) {
        // @deprecated
        // TODO: Maybe we should return this promise in next major version
        validation.run(e);
      },
      reset,
      updateErrorsByPath(path, update) {
        const instanceId = pathToId(idPrefix, idSeparator, path);
        const list = errors.get(instanceId);
        errors.set(
          instanceId,
          update(list ?? []).map((e) => ({ ...e, instanceId }))
        );
      },
      enhance(node) {
        $effect(() => {
          node.addEventListener("submit", submitHandler);
          node.addEventListener("reset", resetHandler);
          return () => {
            node.removeEventListener("submit", submitHandler);
            node.removeEventListener("reset", resetHandler);
          };
        });
      },
    },
    {
      get inputsValidationMode() {
        return inputsValidationMode;
      },
      get validateAdditionalPropertyKey() {
        return additionalPropertyKeyValidator;
      },
      validation,
      fieldValidation,
      get isSubmitted() {
        return isSubmitted;
      },
      get isChanged() {
        return isChanged;
      },
      set isChanged(v) {
        isChanged = v;
      },
      get errors() {
        return errors;
      },
      get schema() {
        return options.schema;
      },
      get uiSchema() {
        return uiSchema;
      },
      get disabled() {
        return disabled;
      },
      get idPrefix() {
        return idPrefix;
      },
      get idSeparator() {
        return idSeparator;
      },
      get idPseudoSeparator() {
        return pseudoIdSeparator;
      },
      get validator() {
        return options.validator;
      },
      get merger() {
        return merger;
      },
      get fields() {
        return fields;
      },
      get templates() {
        return templates;
      },
      get components() {
        return options.components;
      },
      get widgets() {
        return options.widgets;
      },
      get translation() {
        return options.translation;
      },
      get icons() {
        return icons;
      },
      get schedulerYield() {
        return schedulerYield;
      },
      IconOrTranslation,
      iconOrTranslation: ((
        internals: ComponentInternals,
        data: IconOrTranslationData | (() => IconOrTranslationData)
      ) => {
        IconOrTranslation(
          internals,
          // Looks like during SSR the `data` is not a getter function
          // TODO: Clarify how to detect SSR in Svelte (not SvelteKit)
          typeof data === "function"
            ? {
                get data() {
                  return data();
                },
              }
            : {
                data,
              }
        );
      }) as unknown as Snippet<[IconOrTranslationData]>,
    },
  ];
}

/**
 * Create a FormAPI and set form context
 * @deprecated use `useForm2`
 */
export function useForm<T, E>(options: UseFormOptions<T, E>): FormAPI<T, E> {
  return useForm2(options);
}

/**
 * Create a FormAPI and set form context
 */
export function useForm2<O extends UseFormOptions2<any, any>>(options: O) {
  const [api, ctx] = createForm2(options);
  setFromContext(ctx);
  return api;
}
