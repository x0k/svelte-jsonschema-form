import { SvelteMap } from "svelte/reactivity";

import type { MaybePromise } from "@/lib/types.js";
import { makeDataURLtoBlob } from "@/lib/file.js";
import type { SchedulerYield } from "@/lib/scheduler.js";
import {
  abortPrevious,
  createAction,
  debounce,
  type Action,
  type ActionsCombinator,
  type FailedAction,
} from "@/lib/action.svelte.js";
import type { Schema } from "@/core/index.js";

import {
  ValidationProcessError,
  type FormValidator,
  AdditionalPropertyKeyError,
  type AdditionalPropertyKeyValidator,
  type ValidationError,
  NO_VALIDATION_ERRORS,
  type ValidationErrors,
  isAdditionalPropertyKeyValidator,
  isFormValueValidator,
  isFieldValueValidator,
} from "./validator.js";
import type { Translation } from "./translation.js";
import type { UiSchemaRoot } from "./ui-schema.js";
import type { IconsResolver } from "./icons.js";
import type { FieldsValidationMode } from "./validation.js";
import {
  groupErrors,
  type FormErrors,
  type FieldErrors,
  NO_FORM_ERRORS,
  NO_FIELD_ERRORS,
} from "./errors.js";
import type { FormContext } from "./context/index.js";
import { DefaultFormMerger, type FormMerger } from "./merger.js";
import {
  DEFAULT_ID_PREFIX,
  DEFAULT_ID_SEPARATOR,
  DEFAULT_PSEUDO_ID_SEPARATOR,
  pathToId,
  type Id,
} from "./id.js";
import type { Config } from "./config.js";
import type { ThemeResolver } from "./theme.js";
import type { FieldValue, FormValue } from "./model.js";

export const DEFAULT_FIELDS_VALIDATION_DEBOUNCE_MS = 300;

export interface FormOptions<T, E> {
  validator: FormValidator<E>;
  schema: Schema;
  theme: ThemeResolver;
  translation: Translation;
  uiSchema?: UiSchemaRoot;
  merger?: FormMerger;
  icons?: IconsResolver;
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
   * @default (ctx) => $state.snapshot(ctx.value)
   */
  getSnapshot?: (ctx: FormContext<E>) => FormValue;
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
   * Will be called when the form is reset and will not be triggered by the `form.reset` call.
   */
  onReset?: (e: Event) => void;
  schedulerYield?: SchedulerYield;
}

export type ValidationProcessErrorTranslation = (
  state: FailedAction<unknown>
) => string;

export interface FormState<T, E> {
  readonly context: FormContext<E>;
  readonly validation: Action<
    [event: SubmitEvent],
    {
      snapshot: FormValue;
      validationErrors: FormErrors<E>;
    },
    unknown
  >;
  readonly fieldsValidation: Action<
    [config: Config, value: FormValue],
    FieldErrors<E>,
    unknown
  >;
  value: T | undefined;
  isSubmitted: boolean;
  isChanged: boolean;
  errors: FormErrors<E>;
  validate(): FormErrors<E>;
  validateAsync(signal: AbortSignal): Promise<FormErrors<E>>;
  submit(e: SubmitEvent): Promise<void>;
  reset(): void;
  updateErrorsByPath(
    path: Array<string | number>,
    update: (errors: FieldErrors<E>) => FieldErrors<E>
  ): void;
}

export type ExtractAdditionalPropertyKeyError<O extends FormOptions<any, any>> =
  O["validator"] extends AdditionalPropertyKeyValidator
    ? AdditionalPropertyKeyError
    : never;

export function createForm<
  T,
  VE,
  O extends FormOptions<T, E>,
  E = VE | ValidationProcessError | ExtractAdditionalPropertyKeyError<O>,
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
    const v = options.validator;
    return isAdditionalPropertyKeyValidator(v)
      ? (config: Config, key: string, fieldConfig: Config) => {
          const messages = v.validateAdditionalPropertyKey(key, config.schema);
          errors.set(
            fieldConfig.id,
            messages.map((message) => ({
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
    const v = options.validator;
    if (!isFormValueValidator(v)) {
      return NO_FORM_ERRORS;
    }
    const errors = v.validateFormValue?.(options.schema, snapshot, signal);
    if (errors instanceof Promise) {
      return errors.then(groupErrors);
    }
    return groupErrors(errors);
  }

  const validation = createAction({
    async execute(signal, _event: SubmitEvent) {
      isSubmitted = true;
      const snapshot = getSnapshot(context);
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
    onFailure(error, e) {
      errors.set(context.rootId, [
        {
          propertyTitle: "",
          message: options.translation("validation-process-error", { error }),
          error: new ValidationProcessError(error) as E,
        },
      ]);
      options.onValidationFailure?.(error, e);
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

  const validateFields = $derived.by(() => {
    const v = options.validator;
    return isFieldValueValidator(v)
      ? (signal: AbortSignal, config: Config, value: FieldValue) =>
          v.validateFieldValue?.(config, value, signal)
      : () => NO_VALIDATION_ERRORS;
  });

  const fieldsValidation = createAction({
    async execute(signal, config, value) {
      return validateFields(signal, config, value);
    },
    onSuccess(validationErrors: ValidationErrors<E>, config) {
      if (validationErrors.length > 0) {
        errors.set(config.id, validationErrors);
      } else {
        errors.delete(config.id);
      }
    },
    onFailure(error, config, value) {
      if (error.reason !== "aborted") {
        errors.set(config.id, [
          {
            propertyTitle: config.title,
            message: options.translation("validation-process-error", { error }),
            error: new ValidationProcessError(error) as E,
          },
        ]);
      }
      options.onFieldsValidationFailure?.(error, config, value);
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

  function resetHandler(e: Event) {
    e.preventDefault();
    reset();
    options.onReset?.(e);
  }

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
      return options.icons;
    },
  };

  const fakeAbortSignal = new AbortController().signal;

  return {
    get value() {
      return getSnapshot(context) as T | undefined;
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
      const errors = validateSnapshot(getSnapshot(context), fakeAbortSignal);
      if (errors instanceof Promise) {
        throw new Error("`validate` cannot be called with async validator");
      }
      return errors;
    },
    async validateAsync(signal: AbortSignal) {
      return validateSnapshot(getSnapshot(context), signal);
    },
    submit(e) {
      return validation.run(e);
    },
    reset,
    updateErrorsByPath(path, update) {
      const instanceId = pathToId(idPrefix, idSeparator, path);
      const list = errors.get(instanceId);
      errors.set(instanceId, update(list ?? NO_FIELD_ERRORS));
    },
  };
}
