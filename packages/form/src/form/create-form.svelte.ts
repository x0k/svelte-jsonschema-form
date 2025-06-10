import { SvelteMap } from "svelte/reactivity";
import { on } from "svelte/events";

import { createDataURLtoBlob } from "@/lib/file.js";
import type { SchedulerYield } from "@/lib/scheduler.js";
import {
  abortPrevious,
  createAction,
  type ActionsCombinator,
  type FailedAction,
} from "@/lib/action.svelte.js";
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
import { type FormInternalContext, type FormContext } from "./context/index.js";
import { createFormMerger, type FormMerger } from "./merger.js";
import {
  type Id,
  DEFAULT_ID_PREFIX,
  DEFAULT_ID_PSEUDO_SEPARATOR,
  DEFAULT_ID_SEPARATOR,
} from "./id.js";
import type { Config } from "./config.js";
import type { Theme } from "./components.js";
import type { FormValue } from "./model.js";
import type { ResolveFieldType } from "./fields.js";

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

// How this `extends` works?
export interface FormOptions<T, V extends Validator>
  extends UiOptionsRegistryOption {
  validator: V;
  schema: Schema;
  theme: Theme;
  translation: Translation;
  resolver: (ctx: FormInternalContext<V>) => ResolveFieldType;
  icons?: Icons;
  uiSchema?: UiSchemaRoot;
  extraUiOptions?: ExtraUiOptions;
  merger?: FormMerger;
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
  initialValue?: Partial<T>;
  initialErrors?: InitialErrors<V>;
  /**
   * @default waitPrevious
   */
  submissionCombinator?: ActionsCombinator<
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
  fieldsValidationCombinator?: ActionsCombinator<
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
  onSubmissionFailure?: (state: FailedAction<unknown>, e: SubmitEvent) => void;
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

export interface FormState<T, V extends Validator> {
  readonly context: FormContext;
  readonly submission: FormSubmission<V>;
  readonly fieldsValidation: FieldsValidation<V>;
  /**
   * An accessor that maintains form state consistency:
   *
   * - A snapshot of the form state is returned on access
   * - Default values from JSON Schema are taken into account during assignment
   *
   * You can gain direct access to the internal state by hacking types:
   *
   * `(form.context as FormInternalContext<typeof validator>).value`
   */
  value: T | undefined;
  isSubmitted: boolean;
  isChanged: boolean;
  errors: FieldErrorsMap<PossibleError<V>>;
  submit(e: SubmitEvent): void;
  reset(e: Event): void;
}

export function createForm<T, V extends Validator>(
  options: FormOptions<T, V>
): FormState<T, V> {
  const merger = $derived(
    options.merger ?? createFormMerger(options.validator, options.schema)
  );

  let value = $state(
    // svelte-ignore state_referenced_locally
    merger.mergeFormDataAndSchemaDefaults(
      options.initialValue as FormValue,
      options.schema
    )
  );
  let errors = $state.raw(
    Array.isArray(options.initialErrors)
      ? groupErrors(options.initialErrors)
      : new SvelteMap(options.initialErrors)
  );
  let isSubmitted = $state.raw(false);
  let isChanged = $state.raw(false);

  const fieldsValidationMode = $derived(options.fieldsValidationMode ?? 0);
  const uiSchemaRoot = $derived(options.uiSchema ?? {});
  const uiSchema = $derived(resolveUiRef(uiSchemaRoot, options.uiSchema) ?? {});
  const disabled = $derived(options.disabled ?? false);
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

  const translate = $derived(createTranslate(options.translation));

  const validateForm: AsyncFormValueValidator<
    AnyFormValueValidatorError<V>
  >["validateFormValueAsync"] = $derived.by(() => {
    const v = options.validator;
    if (isAsyncFormValueValidator(v)) {
      return (signal, schema, formValue) =>
        v.validateFormValueAsync(signal, schema, formValue);
    }
    if (isFormValueValidator(v)) {
      return (_, schema, formValue) =>
        Promise.resolve(v.validateFormValue(schema, formValue));
    }
    return async () => Promise.resolve([]);
  });

  const submission: FormSubmission<V> = createAction({
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
    const v = options.validator;
    if (isAsyncFieldValueValidator(v)) {
      return (signal, config, value) =>
        v.validateFieldValueAsync(signal, config, value);
    }
    if (isFieldValueValidator(v)) {
      return (_, config, value) =>
        Promise.resolve(v.validateFieldValue(config, value));
    }
    return () => Promise.resolve([]);
  });

  const fieldsValidation: FieldsValidation<V> = createAction({
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
    errors.clear();
    value = merger.mergeFormDataAndSchemaDefaults(
      options.initialValue as FormValue,
      options.schema
    );
    options.onReset?.(e);
  }

  const rootId = $derived(options.idPrefix ?? DEFAULT_ID_PREFIX);

  const uiOptionsRegistry = $derived(options[UI_OPTIONS_REGISTRY_KEY] ?? {});

  const uiOptions = $derived({
    ...uiSchemaRoot["ui:globalOptions"],
    ...uiSchema["ui:options"],
  });

  const context: FormInternalContext<V> = {
    ...({} as FormContext),
    get rootId() {
      return rootId as Id;
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
    submission,
    fieldsValidation,
    get dataUrlToBlob() {
      return dataUrlToBlob;
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
      return errors;
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
      return options.idPrefix ?? DEFAULT_ID_PREFIX;
    },
    get idSeparator() {
      return options.idSeparator ?? DEFAULT_ID_SEPARATOR;
    },
    get idPseudoSeparator() {
      return options.idPseudoSeparator ?? DEFAULT_ID_PSEUDO_SEPARATOR;
    },
    get validator() {
      return options.validator;
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
  };
  const fieldTypeResolver = $derived(options.resolver(context));

  return {
    context,
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
    submission,
    fieldsValidation,
    submit: submitHandler,
    reset: resetHandler,
  };
}

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
