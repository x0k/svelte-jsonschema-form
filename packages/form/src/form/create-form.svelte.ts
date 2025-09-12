import type { Attachment } from "svelte/attachments";
import { SvelteMap } from "svelte/reactivity";
import { on } from "svelte/events";

import type { DeepPartial } from '@/lib/types.js';
import type { SchedulerYield } from "@/lib/scheduler.js";
import { refFromBind, type Bind, type Ref } from "@/lib/svelte.svelte.js";
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
  InvalidValidatorError,
} from "./errors.js";
import type { FormMerger } from "./merger.js";
import {
  type Id,
  DEFAULT_ID_PREFIX,
  DEFAULT_ID_PSEUDO_SEPARATOR,
  DEFAULT_ID_SEPARATOR,
} from "./id.js";
import type { Config } from "./config.js";
import type { Theme } from "./components.js";
import type { FormValue, KeyedArraysMap } from "./model.js";
import type { ResolveFieldType } from "./fields.js";
import { createSchemaValuesReconciler, UNCHANGED } from "./reconcile.js";
import type { FormState } from "./state/index.js";
import {
  FORM_DATA_URL_TO_BLOB,
  FORM_UI_EXTRA_OPTIONS,
  FORM_FIELDS_VALIDATION_MODE,
  FORM_KEYED_ARRAYS,
  FORM_SCHEMA,
  FORM_UI_SCHEMA,
  FORM_UI_SCHEMA_ROOT,
  FORM_VALUE,
  FORM_UI_OPTIONS_REGISTRY,
  FORM_DISABLED,
  FORM_VALIDATOR,
  FORM_MERGER,
  FORM_RESOLVER,
  FORM_THEME,
  FORM_TRANSLATION,
  FORM_TRANSLATE,
  FORM_ICONS,
  FORM_MARK_SCHEMA_CHANGE,
  FORM_ROOT_ID,
} from "./internals.js";

export const DEFAULT_FIELDS_VALIDATION_DEBOUNCE_MS = 300;

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

export interface GetSnapshotOptions<V extends Validator> {
  validator: V;
  merger: FormMerger;
  schema: Schema;
  value: FormValue;
}

export interface FormOptions<T, V extends Validator>
  extends UiOptionsRegistryOption {
  schema: Schema;
  theme: Theme;
  translation: Translation;
  resolver: (ctx: FormState<T, V>) => ResolveFieldType;
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
  initialValue?: DeepPartial<T>;
  value?: Bind<T>;
  initialErrors?: InitialErrors<V>;
  errors?: Bind<FieldErrorsMap<PossibleError<V>>>;
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
  getSnapshot?: (ctx: GetSnapshotOptions<V>) => FormValue;
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

export function createForm<T, V extends Validator>(
  options: FormOptions<T, V>
): FormState<T, V> {
  /** STATE BEGIN */
  const idPrefix = $derived(options.idPrefix ?? DEFAULT_ID_PREFIX) as Id;
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
      ? refFromBind(options.value as unknown as Bind<FormValue>)
      : createValueRef(merger, options.schema, options.initialValue)
  );
  const errorsRef = $derived(
    options.errors
      ? refFromBind(options.errors)
      : createErrorsRef(options.initialErrors)
  );
  const disabled = $derived(options.disabled ?? false);
  let isSubmitted = $state.raw(false);
  let isChanged = $state.raw(false);
  const fieldsValidationMode = $derived(options.fieldsValidationMode ?? 0);
  const uiOptionsRegistry = $derived(options[UI_OPTIONS_REGISTRY_KEY] ?? {});
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
                // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
                reject(signal.reason);
              } else {
                resolve();
              }
            }, 0);
          })
  );
  const dataUrlToBlob = $derived(createDataURLtoBlob(schedulerYield));
  const getSnapshot = $derived.by(() => {
    const get = options.getSnapshot;
    if (get === undefined) {
      return () => $state.snapshot(valueRef.current);
    }
    const opts: GetSnapshotOptions<V> = {
      get merger() {
        return merger;
      },
      get schema() {
        return options.schema;
      },
      get validator() {
        return validator;
      },
      get value() {
        return valueRef.current;
      },
    };
    return () => get(opts);
  });
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
    async execute(signal) {
      isSubmitted = true;
      const formValue = getSnapshot();
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
      errorsRef.current.set(idPrefix, [
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

  function submit(e: SubmitEvent) {
    e.preventDefault();
    submission.run(e);
  }

  function reset(e: Event) {
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

  function validate() {
    if (!isFormValueValidator(validator)) {
      throw new InvalidValidatorError(`expected sync from validator`);
    }
    return groupErrors(
      validator.validateFormValue(options.schema, getSnapshot())
    );
  }

  async function validateAsync(signal: AbortSignal) {
    if (!isAsyncFormValueValidator(validator)) {
      throw new InvalidValidatorError(`expected async form validator`);
    }
    return groupErrors(
      await validator.validateFormValueAsync(
        signal,
        options.schema,
        getSnapshot()
      )
    );
  }

  const formState: FormState<T, V> = {
    submission,
    fieldsValidation,
    get value() {
      return getSnapshot() as T | undefined;
    },
    set value(v) {
      valueRef.current = merger.mergeFormDataAndSchemaDefaults(
        v as FormValue,
        options.schema
      );
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
    set errors(v) {
      errorsRef.current = v;
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
    submit,
    reset,
    validate,
    validateAsync,
    // INTERNALS
    get [FORM_ROOT_ID]() {
      return idPrefix;
    },
    get [FORM_VALUE]() {
      return valueRef.current;
    },
    set [FORM_VALUE](v) {
      valueRef.current = v;
    },
    get [FORM_FIELDS_VALIDATION_MODE]() {
      return fieldsValidationMode;
    },
    get [FORM_DATA_URL_TO_BLOB]() {
      return dataUrlToBlob;
    },
    get [FORM_KEYED_ARRAYS]() {
      return keyedArrays;
    },
    get [FORM_SCHEMA]() {
      return options.schema;
    },
    get [FORM_UI_SCHEMA_ROOT]() {
      return uiSchemaRoot;
    },
    get [FORM_UI_SCHEMA]() {
      return uiSchema;
    },
    get [FORM_UI_EXTRA_OPTIONS]() {
      return options.extraUiOptions;
    },
    get [FORM_UI_OPTIONS_REGISTRY]() {
      return uiOptionsRegistry;
    },
    get [FORM_DISABLED]() {
      return disabled;
    },
    get [FORM_VALIDATOR]() {
      return validator;
    },
    get [FORM_MERGER]() {
      return merger;
    },
    get [FORM_RESOLVER]() {
      return fieldTypeResolver;
    },
    get [FORM_THEME]() {
      return options.theme;
    },
    get [FORM_TRANSLATION]() {
      return options.translation;
    },
    get [FORM_TRANSLATE]() {
      return translate;
    },
    get [FORM_ICONS]() {
      return options.icons;
    },
    [FORM_MARK_SCHEMA_CHANGE]() {
      if (isDefaultsInjectionQueued) return;
      isDefaultsInjectionQueued = true;
      queueMicrotask(injectSchemaDefaults);
    },
  };
  const fieldTypeResolver = $derived(options.resolver(formState));

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
  return formState;
}

export function handlers<T, V extends Validator>(
  form: FormState<T, V>
): Attachment<HTMLFormElement> {
  return (node) => {
    const disposeSubmit = on(node, "submit", form.submit);
    const disposeReset = on(node, "reset", form.reset);
    return () => {
      disposeReset();
      disposeSubmit();
    };
  };
}
