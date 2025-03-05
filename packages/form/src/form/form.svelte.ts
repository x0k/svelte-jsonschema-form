import { SvelteMap } from "svelte/reactivity";

import { createDataURLtoBlob } from "@/lib/file.js";
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
  type ValidationError,
  isSyncFormValueValidator,
  isSyncFieldValueValidator,
  isAsyncFormValueValidator,
  isAsyncFieldValueValidator,
  type SyncFormValueValidator,
  type AsyncFormValueValidator,
} from "./validator.js";
import type { Translation } from "./translation.js";
import type { UiSchemaRoot } from "./ui-schema.js";
import type { Icons } from "./icons.js";
import type { FieldsValidationMode } from "./validation.js";
import {
  groupErrors,
  type FieldErrorsMap,
  type CombinedError,
  type FieldError,
} from "./errors.js";
import { translate, type FormContext } from "./context/index.js";
import { DefaultFormMerger, type FormMerger } from "./merger.js";
import {
  type Id,
  DEFAULT_ID_PREFIX,
  DEFAULT_ID_SEPARATOR,
  DEFAULT_PSEUDO_ID_SEPARATOR,
} from "./id.js";
import type { Config } from "./config.js";
import type { Theme } from "./components.js";
import type { FieldValue, FormValue } from "./model.js";

export const DEFAULT_FIELDS_VALIDATION_DEBOUNCE_MS = 300;

export interface FormOptions<T, E, FV extends FormValidator<E>> {
  validator: FV;
  schema: Schema;
  theme: Theme;
  translation: Translation;
  icons?: Icons;
  uiSchema?: UiSchemaRoot;
  merger?: FormMerger;
  fieldsValidationMode?: FieldsValidationMode;
  disabled?: boolean;
  idPrefix?: string;
  idSeparator?: string;
  pseudoIdSeparator?: string;
  //
  initialValue?: T;
  initialErrors?:
    | FieldErrorsMap<CombinedError<E, FV>>
    | Iterable<readonly [Id, FieldError<CombinedError<E, FV>>[]]>;
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
  getSnapshot?: (ctx: FormContext<E, FV>) => FormValue;
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
    errors: FieldErrorsMap<E>,
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
   * Will be called when the form is reset.
   */
  onReset?: (e: Event) => void;
  schedulerYield?: SchedulerYield;
}

export type ValidationProcessErrorTranslation = (
  state: FailedAction<unknown>
) => string;

export interface FormValidationResult<E> {
  formValue: FormValue;
  formErrors: FieldErrorsMap<E>;
}

export type FormState<T, E, FV extends FormValidator<E>> = {
  readonly validation: Action<
    [event: SubmitEvent],
    FormValidationResult<E>,
    unknown
  >;
  readonly fieldsValidation: Action<
    [config: Config, value: FormValue],
    FieldError<E>[],
    unknown
  >;
  value: T | undefined;
  isSubmitted: boolean;
  isChanged: boolean;
  errors: FieldErrorsMap<CombinedError<E, FV>>;
  submit(e: SubmitEvent): Promise<void>;
  reset(e: Event): void;
} & (FV extends SyncFormValueValidator<E>
  ? {
      validate(): FieldErrorsMap<E>;
    }
  : {}) &
  (FV extends AsyncFormValueValidator<E>
    ? {
        validateAsync(signal: AbortSignal): Promise<FieldErrorsMap<E>>;
      }
    : {});

export interface FormInternals<E, FV extends FormValidator<E>> {
  readonly context: FormContext<E, FV>;
}

export function createForm<T, E, FV extends FormValidator<E>>(
  options: FormOptions<T, E, FV>
): FormState<T, E, FV> & FormInternals<E, FV> {
  type CErr = CombinedError<E, FV>;

  const NO_VALIDATION_ERRORS: ValidationError<E>[] = [];

  const merger = $derived(
    options.merger ?? new DefaultFormMerger(options.validator, options.schema)
  );

  let value = $state(
    // svelte-ignore state_referenced_locally
    merger.mergeFormDataAndSchemaDefaults(
      options.initialValue as FormValue,
      options.schema
    )
  );
  let errors: FieldErrorsMap<CErr> = $state(
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
  const dataUrlToBlob = $derived(createDataURLtoBlob(schedulerYield));

  const getSnapshot = $derived(
    options.getSnapshot ?? (() => $state.snapshot(value))
  );

  const validateForm = $derived.by(() => {
    const v = options.validator;
    if (isAsyncFormValueValidator(v)) {
      return v.validateFormValueAsync;
    }
    if (isSyncFormValueValidator(v)) {
      return (_: AbortSignal, schema: Schema, formValue: FormValue) =>
        v.validateFormValue(schema, formValue);
    }
    return () => NO_VALIDATION_ERRORS;
  });

  const validation = createAction({
    async execute(signal, _event: SubmitEvent) {
      const formValue = getSnapshot(context);
      return {
        formValue,
        formErrors: groupErrors(
          await validateForm(signal, options.schema, formValue)
        ),
      };
    },
    onSuccess({ formValue, formErrors }: FormValidationResult<E>, event) {
      errors = formErrors;
      if (errors.size === 0) {
        options.onSubmit?.(formValue as T, event);
        isChanged = false;
        return;
      }
      options.onSubmitError?.(formErrors, event, formValue);
    },
    onFailure(error, e) {
      errors.set(context.rootId, [
        {
          propertyTitle: "",
          message: translate(context, "validation-process-error", { error }),
          error: new ValidationProcessError(error),
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
    if (isAsyncFieldValueValidator(v)) {
      return v.validateFieldValueAsync;
    }
    if (isSyncFieldValueValidator(v)) {
      return (_: AbortSignal, config: Config, value: FieldValue) =>
        v.validateFieldValue(config, value);
    }
    return () => NO_VALIDATION_ERRORS;
  });

  const fieldsValidation = createAction({
    async execute(signal, config, value) {
      return validateFields(signal, config, value);
    },
    onSuccess(fieldErrors: FieldError<E>[], config) {
      if (fieldErrors.length > 0) {
        errors.set(config.id, fieldErrors);
      } else {
        errors.delete(config.id);
      }
    },
    onFailure(error, config, value) {
      if (error.reason !== "aborted") {
        errors.set(config.id, [
          {
            propertyTitle: config.title,
            message: translate(context, "validation-process-error", { error }),
            error: new ValidationProcessError(error),
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
    isSubmitted = true;
    return validation.run(e);
  }

  function resetHandler(e: Event) {
    e.preventDefault();
    isSubmitted = false;
    isChanged = false;
    errors.clear();
    value = merger.mergeFormDataAndSchemaDefaults(
      options.initialValue as FormValue,
      options.schema
    );
    options.onReset?.(e);
  }

  const uiOptions = $derived({
    ...uiSchema["ui:globalOptions"],
    ...uiSchema["ui:options"],
  });

  const context: FormContext<E, FV> = {
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
    get fieldsValidationMode() {
      return fieldsValidationMode;
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
    submitHandler,
    resetHandler,
  };

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
      const v = options.validator;
      if (!isSyncFormValueValidator(v)) {
        throw new Error(
          `Unsupported validator type, expected sync form value validator`
        );
      }
      return groupErrors(
        v.validateFormValue(options.schema, getSnapshot(context))
      );
    },
    async validateAsync(signal: AbortSignal) {
      const v = options.validator;
      if (!isAsyncFormValueValidator(v)) {
        throw new Error(
          `Unsupported validator type, expected async form value validator`
        );
      }
      return groupErrors(
        await v.validateFormValueAsync(
          signal,
          options.schema,
          getSnapshot(context)
        )
      );
    },
    submit: submitHandler,
    reset: resetHandler,
  };
}

export function enhance(node: HTMLFormElement, ctx: FormContext<any, any>) {
  $effect(() => {
    node.addEventListener("submit", ctx.submitHandler);
    node.addEventListener("reset", ctx.resetHandler);
    return () => {
      node.removeEventListener("submit", ctx.submitHandler);
      node.removeEventListener("reset", ctx.resetHandler);
    };
  });
}
