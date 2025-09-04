import { setContext } from "svelte";
import type { Attachment } from "svelte/attachments";
import { SvelteMap } from "svelte/reactivity";
import { on } from "svelte/events";

import { type Ref, type Lens, refFromLens } from "@/lib/svelte.svelte.js";
import type { SchedulerYield } from "@/lib/scheduler.js";
import { createDataURLtoBlob } from "@/lib/file.js";
import {
  abortPrevious,
  createTask,
  type TasksCombinator,
  type FailedTask,
} from "@/lib/task.svelte.js";
import type { Schema, Validator } from "@/core/index.js";

import {
  type ValidationError,
  isFormValueValidator,
  isFieldValueValidator,
  isAsyncFormValueValidator,
  isAsyncFieldValueValidator,
  type AsyncFormValueValidator,
  type AsyncFieldValueValidator,
} from "./validator.js";
import { createTranslate, type Translation } from "./translation.js";
import {
  resolveUiRef,
  type ExtraUiOptions,
  type UiOptionsRegistry,
  type UiSchemaRoot,
} from "./ui-schema.js";
import type { Icons } from "./icons.js";
import type { FieldsValidationMode } from "./validation.js";
import {
  groupErrors,
  ValidationProcessError,
  type FieldError,
  type PossibleError,
  type FieldErrorsMap,
  type AnyFormValueValidatorError,
  type AnyFieldValueValidatorError,
  type FormSubmission,
  type FieldsValidation,
  type FormValidationResult,
} from "./errors.js";
import {
  type FormInternalContext,
  type FormContext,
  FORM_CONTEXT,
} from "./context/index.js";
import type { FormMerger } from "./merger.js";
import {
  type Id,
  DEFAULT_ID_PREFIX,
  DEFAULT_ID_PSEUDO_SEPARATOR,
  DEFAULT_ID_SEPARATOR,
} from "./id.js";
import type { Config } from "./config.js";
import type { Theme } from "./components.js";
import type { FormValue, KeyedArraysMap, ValueRef } from "./model.js";
import type { ResolveFieldType } from "./fields.js";
import { createSchemaValuesReconciler, UNCHANGED } from "./reconcile.js";

export const DEFAULT_FIELDS_VALIDATION_DEBOUNCE_MS = 300;

export type InitialValue<T> = T extends Record<string, any> ? Partial<T> : T;

export type InitialErrors<V extends Validator> =
  | ValidationError<PossibleError<V>>[]
  | Iterable<readonly [Id, FieldError<PossibleError<V>>[]]>;

const UI_OPTIONS_REGISTRY_KEY = "uiOptionsRegistry";

export type UiOptionsRegistryOption = keyof UiOptionsRegistry extends never
  ? {
      [UI_OPTIONS_REGISTRY_KEY]?: UiOptionsRegistry;
    }
  : {
      [UI_OPTIONS_REGISTRY_KEY]: UiOptionsRegistry;
    };

function createValueRef<T>(
  merger: FormMerger,
  schema: Schema,
  initialValue: T | Partial<T>
): Ref<FormValue> {
  let value = $state(
    merger.mergeFormDataAndSchemaDefaults(initialValue as FormValue, schema)
  );
  return {
    get current() {
      return value;
    },
    set current(v) {
      value = v;
    },
  };
}

function createErrorsRef<V extends Validator>(
  initialErrors: InitialErrors<V> | undefined
): Ref<FieldErrorsMap<PossibleError<V>>> {
  let value = $state.raw(
    Array.isArray(initialErrors)
      ? groupErrors(initialErrors)
      : new SvelteMap(initialErrors)
  );
  return {
    get current() {
      return value;
    },
    set current(v) {
      value = v;
    },
  };
}

export interface ValidatorFactoryOptions {
  schema: Schema;
  uiSchema: UiSchemaRoot;
  idPrefix: string;
  idSeparator: string;
  idPseudoSeparator: string;
  /**
   * This is a getter that can be used to access the Merger lazily.
   */
  merger: () => FormMerger;
}
export interface MergerFactoryOptions<V extends Validator> {
  validator: V;
  schema: Schema;
  uiSchema: UiSchemaRoot;
}

export interface FormOptions<T, V extends Validator>
  extends UiOptionsRegistryOption {
  schema: Schema;
  theme: Theme;
  translation: Translation;
  resolver: (ctx: FormInternalContext<V>) => ResolveFieldType;
  createValidator: (options: ValidatorFactoryOptions) => V;
  createMerger: (options: MergerFactoryOptions<V>) => FormMerger;
  icons?: Icons;
  uiSchema?: UiSchemaRoot;
  extraUiOptions?: ExtraUiOptions;
  fieldsValidationMode?: FieldsValidationMode;
  disabled?: boolean;
  /**
   * @default DEFAULT_ID_PREFIX
   */
  idPrefix?: string;
  /**
   * @default DEFAULT_ID_SEPARATOR
   */
  idSeparator?: string;
  /**
   * @default DEFAULT_ID_PSEUDO_SEPARATOR
   */
  idPseudoSeparator?: string;
  //
  initialValue?: InitialValue<T>;
  value?: Lens<T>;
  initialErrors?: InitialErrors<V>;
  errors?: Lens<FieldErrorsMap<PossibleError<V>>>;
  /**
   * @default waitPrevious
   */
  submissionCombinator?: TasksCombinator<
    [event: SubmitEvent],
    FormValidationResult<AnyFormValueValidatorError<V>>,
    unknown
  >;
  /**
   * @default 500
   */
  submissionDelayedMs?: number;
  /**
   * @default 8000
   */
  submissionTimeoutMs?: number;
  /**
   * @default 300
   */
  fieldsValidationDebounceMs?: number;
  /**
   * @default abortPrevious
   */
  fieldsValidationCombinator?: TasksCombinator<
    [Config, FormValue],
    FieldError<AnyFieldValueValidatorError<V>>[],
    unknown
  >;
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
  getSnapshot?: (ctx: FormInternalContext<V>) => FormValue;
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
    errors: FieldErrorsMap<AnyFormValueValidatorError<V>>,
    e: SubmitEvent,
    snapshot: FormValue
  ) => void;
  /**
   * Form submission error handler
   *
   * Will be called when the submission fails by a different reasons:
   * - submission is cancelled
   * - error during validation
   * - validation timeout
   */
  onSubmissionFailure?: (state: FailedTask<unknown>, e: SubmitEvent) => void;
  /**
   * Field validation error handler
   */
  onFieldsValidationFailure?: (
    state: FailedTask<unknown>,
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
  keyedArraysMap?: KeyedArraysMap;
}

export interface FormState<T, V extends Validator> {
  /** @deprecated don't use this property */
  readonly context: FormContext;
  readonly [FORM_CONTEXT]: FormInternalContext<V>;
  readonly submission: FormSubmission<V>;
  readonly fieldsValidation: FieldsValidation<V>;
  /**
   * An accessor that maintains form state consistency:
   *
   * - A snapshot of the form state is returned on access
   * - Default values from JSON Schema are taken into account during assignment
   */
  value: T | undefined;
  isSubmitted: boolean;
  isChanged: boolean;
  errors: FieldErrorsMap<PossibleError<V>>;
  submit(e: SubmitEvent): void;
  reset(e: Event): void;
}

export function setFormContext2(form: FormState<any, any>) {
  setContext(FORM_CONTEXT, form[FORM_CONTEXT]);
}

export function createForm<T, V extends Validator>(
  options: FormOptions<T, V>
): FormState<T, V> {
  /** STATE BEGIN */
  const idPrefix = $derived(options.idPrefix ?? DEFAULT_ID_PREFIX);
  const idSeparator = $derived(options.idSeparator ?? DEFAULT_ID_SEPARATOR);
  const idPseudoSeparator = $derived(
    options.idPseudoSeparator ?? DEFAULT_ID_PSEUDO_SEPARATOR
  );
  const uiSchemaRoot = $derived(options.uiSchema ?? {});
  const uiSchema = $derived(resolveUiRef(uiSchemaRoot, options.uiSchema) ?? {});
  const validator = $derived(
    options.createValidator({
      idPrefix,
      idSeparator,
      idPseudoSeparator,
      uiSchema: uiSchemaRoot,
      schema: options.schema,
      merger: (): FormMerger => merger,
    })
  );
  const merger = $derived(
    options.createMerger({
      validator,
      schema: options.schema,
      uiSchema: uiSchemaRoot,
    })
  );
  const valueRef = $derived(
    options.value
      ? refFromLens(options.value as unknown as Lens<FormValue>)
      : createValueRef(merger, options.schema, options.initialValue)
  );
  let errorsRef = $derived(
    options.errors
      ? refFromLens(options.errors)
      : createErrorsRef(options.initialErrors)
  );
  const disabled = $derived(options.disabled ?? false);
  let isSubmitted = $state.raw(false);
  let isChanged = $state.raw(false);
  const fieldsValidationMode = $derived(options.fieldsValidationMode ?? 0);
  const uiOptionsRegistry = $derived(options[UI_OPTIONS_REGISTRY_KEY] ?? {});
  const uiOptions = $derived({
    ...uiSchemaRoot["ui:globalOptions"],
    ...uiSchema["ui:options"],
  });
  const keyedArrays: KeyedArraysMap = $derived(
    options.keyedArraysMap ?? new WeakMap()
  );
  const reconcileSchemaValues = $derived(
    createSchemaValuesReconciler(keyedArrays)
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
    options.getSnapshot ?? (() => $state.snapshot(valueRef.current))
  );
  const translate = $derived(createTranslate(options.translation));
  /** STATE END */

  const validateForm: AsyncFormValueValidator<
    AnyFormValueValidatorError<V>
  >["validateFormValueAsync"] = $derived.by(() => {
    if (isAsyncFormValueValidator(validator)) {
      return (signal, schema, formValue) =>
        validator.validateFormValueAsync(signal, schema, formValue);
    }
    if (isFormValueValidator(validator)) {
      return (_, schema, formValue) =>
        Promise.resolve(validator.validateFormValue(schema, formValue));
    }
    return async () => Promise.resolve([]);
  });

  const submission: FormSubmission<V> = createTask({
    async execute(signal, _event: SubmitEvent) {
      isSubmitted = true;
      const formValue = getSnapshot(context);
      return {
        formValue,
        formErrors: groupErrors(
          await validateForm(signal, options.schema, formValue)
        ),
      };
    },
    onSuccess({ formValue, formErrors }, event) {
      errorsRef.current = formErrors;
      if (formErrors.size === 0) {
        options.onSubmit?.(formValue as T, event);
        isChanged = false;
        return;
      }
      options.onSubmitError?.(formErrors, event, formValue);
    },
    onFailure(error, e) {
      errorsRef.current.set(context.rootId, [
        {
          propertyTitle: "",
          message: translate("validation-process-error", { error }),
          error: new ValidationProcessError(error),
        },
      ]);
      options.onSubmissionFailure?.(error, e);
    },
    get combinator() {
      return options.submissionCombinator;
    },
    get delayedMs() {
      return options.submissionDelayedMs;
    },
    get timeoutMs() {
      return options.submissionTimeoutMs;
    },
  });

  const validateFields: AsyncFieldValueValidator<
    AnyFieldValueValidatorError<V>
  >["validateFieldValueAsync"] = $derived.by(() => {
    if (isAsyncFieldValueValidator(validator)) {
      return (signal, config, value) =>
        validator.validateFieldValueAsync(signal, config, value);
    }
    if (isFieldValueValidator(validator)) {
      return (_, config, value) =>
        Promise.resolve(validator.validateFieldValue(config, value));
    }
    return () => Promise.resolve([]);
  });

  const fieldsValidation: FieldsValidation<V> = createTask({
    execute(signal, config, value) {
      const debounceMs = options.fieldsValidationDebounceMs ?? 300;
      if (debounceMs < 0) {
        return validateFields(signal, config, value);
      }

      const promise =
        Promise.withResolvers<FieldError<AnyFieldValueValidatorError<V>>[]>();
      const id = setTimeout(() => {
        promise.resolve(validateFields(signal, config, value));
      }, debounceMs);

      const onAbort = () => {
        clearTimeout(id);
        promise.reject(
          new DOMException("field validation has been aborted", "AbortError")
        );
      };
      signal.addEventListener("abort", onAbort);
      return promise.promise.finally(() => {
        signal.removeEventListener("abort", onAbort);
      });
    },
    onSuccess(fieldErrors, config) {
      const errors = errorsRef.current;
      if (fieldErrors.length > 0) {
        errors.set(config.id, fieldErrors);
      } else {
        errors.delete(config.id);
      }
    },
    onFailure(error, config, value) {
      if (error.reason !== "aborted") {
        errorsRef.current.set(config.id, [
          {
            propertyTitle: config.title,
            message: translate("validation-process-error", { error }),
            error: new ValidationProcessError(error),
          },
        ]);
      }
      options.onFieldsValidationFailure?.(error, config, value);
    },
    get combinator() {
      return options.fieldsValidationCombinator ?? abortPrevious;
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
    submission.run(e);
  }

  function resetHandler(e: Event) {
    e.preventDefault();
    isSubmitted = false;
    isChanged = false;
    errorsRef.current.clear();
    valueRef.current = merger.mergeFormDataAndSchemaDefaults(
      options.initialValue as FormValue,
      options.schema
    );
    options.onReset?.(e);
  }

  const context: FormInternalContext<V> = {
    ...({} as FormContext),
    get rootId() {
      return idPrefix as Id;
    },
    get value() {
      return valueRef.current;
    },
    set value(v) {
      valueRef.current = v;
    },
    get fieldsValidationMode() {
      return fieldsValidationMode;
    },
    submission,
    fieldsValidation,
    get dataUrlToBlob() {
      return dataUrlToBlob;
    },
    get keyedArrays() {
      return keyedArrays;
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
    get errors() {
      return errorsRef.current;
    },
    get schema() {
      return options.schema;
    },
    get uiSchemaRoot() {
      return uiSchemaRoot;
    },
    get uiSchema() {
      return uiSchema;
    },
    get uiOptions() {
      return uiOptions;
    },
    get extraUiOptions() {
      return options.extraUiOptions;
    },
    get uiOptionsRegistry() {
      return uiOptionsRegistry;
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
      return idPseudoSeparator;
    },
    get validator() {
      return validator;
    },
    get merger() {
      return merger;
    },
    get fieldTypeResolver() {
      return fieldTypeResolver;
    },
    get theme() {
      return options.theme;
    },
    get translation() {
      return options.translation;
    },
    get translate() {
      return translate;
    },
    get icons() {
      return options.icons;
    },
    submitHandler,
    resetHandler,
    markSchemaChange() {
      if (isDefaultsInjectionQueued) return;
      isDefaultsInjectionQueued = true;
      queueMicrotask(injectSchemaDefaults);
    },
  };
  const fieldTypeResolver = $derived(options.resolver(context));

  let isDefaultsInjectionQueued = false;
  function injectSchemaDefaults() {
    isDefaultsInjectionQueued = false;
    const nextValue = merger.mergeFormDataAndSchemaDefaults(
      valueRef.current,
      options.schema
    );
    const change = reconcileSchemaValues(valueRef.current, nextValue);
    if (change !== UNCHANGED) {
      valueRef.current = change;
    }
  }

  return {
    context,
    [FORM_CONTEXT]: context,
    get value() {
      return getSnapshot(context) as T | undefined;
    },
    set value(v) {
      valueRef.current = merger.mergeFormDataAndSchemaDefaults(
        v as FormValue,
        options.schema
      );
    },
    get errors() {
      return errorsRef.current;
    },
    set errors(v) {
      errorsRef.current = v;
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
    submission,
    fieldsValidation,
    submit: submitHandler,
    reset: resetHandler,
  };
}

// TODO: Remove in v3
/** @deprecated use `handlers` attachment */
export function enhance(node: HTMLFormElement, context: FormContext) {
  $effect(() => {
    const ctx = context as FormInternalContext<any>;
    const disposeSubmit = on(node, "submit", ctx.submitHandler);
    const disposeReset = on(node, "reset", ctx.resetHandler);
    return () => {
      disposeReset();
      disposeSubmit();
    };
  });
}

export function handlers(
  ctxOrState: FormState<any, any> | FormInternalContext<any>
): Attachment<HTMLFormElement> {
  const ctx =
    FORM_CONTEXT in ctxOrState ? ctxOrState[FORM_CONTEXT] : ctxOrState;
  return (node) => {
    const disposeSubmit = on(node, "submit", ctx.submitHandler);
    const disposeReset = on(node, "reset", ctx.resetHandler);
    return () => {
      disposeReset();
      disposeSubmit();
    };
  };
}

// TODO: Remove in v4
/** @deprecated use `handlers` */
export const formHandlers = handlers;
