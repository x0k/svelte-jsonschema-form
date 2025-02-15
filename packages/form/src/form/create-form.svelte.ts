import type { EventHandler, FormEventHandler } from "svelte/elements";
import type { Action as SvelteAction } from "svelte/action";
import { SvelteMap } from "svelte/reactivity";

import { makeDataURLtoBlob } from "@/lib/file.js";
import type { SchedulerYield } from "@/lib/scheduler.js";
import type { Schema } from "@/core/index.js";
import {
  abortPrevious,
  createAction,
  debounce,
  type Action,
  type ActionsCombinator,
  type FailedAction,
} from "@/create-action.svelte.js";

import {
  ValidationProcessError,
  type FormValidator,
  AdditionalPropertyKeyError,
  type AdditionalPropertyKeyValidator,
  type ValidationError,
  NO_VALIDATION_ERRORS,
} from "./validator.js";
import type { Translation } from "./translation.js";
import type { UiSchemaRoot } from "./ui-schema.js";
import type { Icons } from "./icons.js";
import type { FieldsValidationMode } from "./validation.js";
import {
  groupErrors,
  type FormErrors,
  type FieldErrors,
  NO_FORM_ERRORS,
} from "./errors.js";
import { setFromContext, type FormContext } from "./context/index.js";
import { DefaultFormMerger, type FormMerger } from "./merger.js";
import {
  DEFAULT_ID_PREFIX,
  DEFAULT_ID_SEPARATOR,
  DEFAULT_PSEUDO_ID_SEPARATOR,
  pathToId,
  type Id,
} from "./id.js";
import IconOrTranslation from "./icon-or-translation.svelte";
import type { Config } from "./config.js";
import type { ThemeResolver } from "./theme.js";
import type { FieldValue, FormValue } from "./model.js";
import type { MaybePromise } from "@/lib/types.js";

export const DEFAULT_FIELDS_VALIDATION_DEBOUNCE_MS = 300;

/**
 * @deprecated use `UseFormOptions2`
 */
export interface UseFormOptions<T, E> {
  validator: FormValidator<E>;
  schema: Schema;
  theme: ThemeResolver;
  translation: Translation;
  uiSchema?: UiSchemaRoot;
  merger?: FormMerger;
  icons?: Icons;
  fieldsValidationMode?: FieldsValidationMode;
  disabled?: boolean;
  idPrefix?: string;
  idSeparator?: string;
  pseudoIdSeparator?: string;
  //
  initialValue?: T;
  initialErrors?:
    | FormErrors<E>
    | Map<Id, FieldErrors<E>>
    | ValidationError<E>[];
  /**
   * @default ignoreNewUntilPreviousIsFinished
   */
  validationCombinator?: ActionsCombinator<[SubmitEvent], unknown>;
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
  fieldsValidationDebounceMs?: number;
  /**
   * @default debounce(abortPrevious, fieldsValidationDebounceMs)
   */
  fieldsValidationCombinator?: ActionsCombinator<[Config, FormValue], unknown>;
  /**
   * @default 500
   */
  fieldsValidationDelayedMs?: number;
  /**
   * @default 8000
   */
  fieldsValidationTimeoutMs?: number;
  /**
   * The function to get the form data snapshot
   *
   * The snapshot is used to validate the form and passed to
   * `onSubmit` and `onSubmitError` handlers.
   *
   * @default () => $state.snapshot(formValue)
   */
  getSnapshot?: () => FormValue;
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
    errors: FormErrors<E>,
    e: SubmitEvent,
    snapshot: FormValue
  ) => void;
  /**
   * Form validation error handler
   *
   * Will be called when the validation fails by a different reasons:
   * - error during validation
   * - validation is cancelled
   * - validation timeout
   */
  onValidationFailure?: (state: FailedAction<unknown>, e: SubmitEvent) => void;
  /**
   * Field validation error handler
   */
  onFieldsValidationFailure?: (
    state: FailedAction<unknown>,
    config: Config,
    value: FormValue
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
  state: FailedAction<unknown>
) => string;

export interface FormOptions<T, E> extends UseFormOptions<T, E> {
  additionalPropertyKeyValidator?: AdditionalPropertyKeyValidator;
  // @deprecated
  // TODO: Move translation functionality to `Translation`
  // and always add `ValidationProcessError` to the errors type
  // so this can be removed
  handleValidationProcessError?: ValidationProcessErrorTranslation;
}

export interface FormState<T, E> {
  context: FormContext<E>;
  value: T | undefined;
  errors: FormErrors<E>;
  isSubmitted: boolean;
  isChanged: boolean;
  validation: Action<
    [event: SubmitEvent],
    {
      snapshot: FormValue;
      validationErrors: FormErrors<E>;
    },
    unknown
  >;
  fieldsValidation: Action<
    [config: Config, value: FormValue],
    FieldErrors<E>,
    unknown
  >;
  validate(): FormErrors<E>;
  validateAsync(signal: AbortSignal): Promise<FormErrors<E>>;
  submit(e: SubmitEvent): void;
  reset(): void;
  updateErrorsByPath(
    path: Array<string | number>,
    update: (errors: FieldErrors<E>) => Omit<ValidationError<E>, "instanceId">[]
  ): void;
}

type FormValueFromOptions<O extends FormOptions<any, any>> =
  O extends FormOptions<infer T, any> ? T : never;

type ValidatorErrorFromOptions<O extends FormOptions<any, any>> =
  O extends FormOptions<any, infer E> ? E : never;

export function createForm3<
  O extends FormOptions<any, any>,
  T = FormValueFromOptions<O>,
  E = ValidatorErrorFromOptions<O>,
>(options: O): FormState<T, E> {
  const merger = $derived(
    options.merger ?? new DefaultFormMerger(options.validator, options.schema)
  );

  let value = $state(
    merger.mergeFormDataAndSchemaDefaults(
      options.initialValue as FormValue,
      options.schema
    )
  );
  let errors: FormErrors<E> = $state(
    Array.isArray(options.initialErrors)
      ? groupErrors(options.initialErrors)
      : new SvelteMap(options.initialErrors)
  );
  let isSubmitted = $state(false);
  let isChanged = $state(false);

  const fieldsValidationMode = $derived(options.fieldsValidationMode ?? 0);
  const uiSchema = $derived(options.uiSchema ?? {});
  const disabled = $derived(options.disabled ?? false);
  const idPrefix = $derived(options.idPrefix ?? DEFAULT_ID_PREFIX);
  const idSeparator = $derived(options.idSeparator ?? DEFAULT_ID_SEPARATOR);
  const pseudoIdSeparator = $derived(
    options.pseudoIdSeparator ?? DEFAULT_PSEUDO_ID_SEPARATOR
  );
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
  const dataUrlToBlob = $derived(makeDataURLtoBlob(schedulerYield));
  const additionalPropertyKeyValidator = $derived.by(() => {
    const validator = options.additionalPropertyKeyValidator;
    return validator
      ? (config: Config, key: string, fieldConfig: Config) => {
          const instanceId = fieldConfig.id;
          const messages = validator.validateAdditionalPropertyKey(
            key,
            config.schema
          );
          errors.set(
            instanceId,
            messages.map((message) => ({
              instanceId,
              propertyTitle: fieldConfig.title,
              message,
              error: new AdditionalPropertyKeyError() as E,
            }))
          );
          return messages.length === 0;
        }
      : () => true;
  });

  const getSnapshot = $derived(
    options.getSnapshot ?? (() => $state.snapshot(value))
  );

  function validateSnapshot(
    snapshot: FormValue,
    signal: AbortSignal
  ): MaybePromise<FormErrors<E>> {
    const errors = options.validator.validateFormValue?.(
      options.schema,
      snapshot,
      signal
    );
    if (errors === undefined) {
      return NO_FORM_ERRORS;
    }
    if (errors instanceof Promise) {
      return errors.then(groupErrors);
    }
    return groupErrors(errors);
  }

  const validation = createAction({
    async execute(signal, _event: SubmitEvent) {
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
        errors.set(context.rootId, [
          {
            propertyTitle: "",
            message: options.handleValidationProcessError(state),
            error: new ValidationProcessError(state) as E,
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

  const fieldsValidation = createAction({
    async execute(signal, config: Config, value: FieldValue) {
      return (
        options.validator.validateFieldValue?.(config, value, signal) ??
        NO_VALIDATION_ERRORS
      );
    },
    onSuccess(validationErrors: ValidationError<E>[], config) {
      if (validationErrors.length > 0) {
        errors.set(config.id, validationErrors);
      } else {
        errors.delete(config.id);
      }
    },
    onFailure(state, config, value) {
      if (options.handleValidationProcessError && state.reason !== "aborted") {
        errors.set(config.id, [
          {
            propertyTitle: config.title,
            message: options.handleValidationProcessError(state),
            error: new ValidationProcessError(state) as E,
          },
        ]);
      }
      options.onFieldsValidationFailure?.(state, config, value);
    },
    get combinator() {
      return (
        options.fieldsValidationCombinator ??
        debounce(
          abortPrevious,
          options.fieldsValidationDebounceMs ??
            DEFAULT_FIELDS_VALIDATION_DEBOUNCE_MS
        )
      );
    },
    get delayedMs() {
      return options.fieldsValidationDelayedMs;
    },
    get timeoutMs() {
      return options.fieldsValidationTimeoutMs;
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
      options.initialValue as FormValue,
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

  const uiOptions = $derived({
    ...uiSchema["ui:globalOptions"],
    ...uiSchema["ui:options"],
  });

  const context: FormContext<E> = {
    submitHandler,
    get rootId() {
      return idPrefix as Id;
    },
    get uiOptions() {
      return uiOptions;
    },
    get value() {
      return value;
    },
    set value(v) {
      value = v;
    },
    get resetHandler() {
      return resetHandler;
    },
    get fieldsValidationMode() {
      return fieldsValidationMode;
    },
    get validateAdditionalPropertyKey() {
      return additionalPropertyKeyValidator;
    },
    validation,
    fieldsValidation,
    get dataUrlToBlob() {
      return dataUrlToBlob;
    },
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
    get theme() {
      return options.theme;
    },
    get translation() {
      return options.translation;
    },
    get icons() {
      return icons;
    },
    IconOrTranslation,
  };

  const fakeAbortSignal = new AbortController().signal;

  return {
    get value() {
      return getSnapshot() as T | undefined;
    },
    set value(v) {
      value = merger.mergeFormDataAndSchemaDefaults(
        v as FormValue,
        options.schema
      );
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
    context,
    validation,
    fieldsValidation,
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
  };
}
