import type { Attachment } from "svelte/attachments";
import { SvelteMap } from "svelte/reactivity";
import { on } from "svelte/events";

import type { DeepPartial } from "@/lib/types.js";
import type { SchedulerYield } from "@/lib/scheduler.js";
import { refFromBind, type Bind, type Ref } from "@/lib/svelte.svelte.js";
import { createDataURLtoBlob } from "@/lib/file.js";
import {
  abortPrevious,
  createTask,
  type TasksCombinator,
  type FailedTask,
} from "@/lib/task.svelte.js";
import { weakMemoize } from "@/lib/memoize.js";
import type { Schema, Validator } from "@/core/index.js";

import {
  isFormValueValidator,
  isFieldValueValidator,
  isAsyncFormValueValidator,
  isAsyncFieldValueValidator,
  type AsyncFormValueValidator,
  type AsyncFieldValueValidator,
  type ValidationError,
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
import type {
  FormSubmission,
  FieldsValidation,
  FormValidationResult,
} from "./errors.js";
import type { FormMerger } from "./merger.js";
import {
  DEFAULT_ID_PREFIX,
  type FieldPath,
  type FormIdBuilder,
  type Id,
} from "./id.js";
import type { Config } from "./config.js";
import type { Theme } from "./components.js";
import {
  create,
  type Creatable,
  type FormValue,
  type KeyedArraysMap,
  type PathTrieRef,
  type Update,
} from "./model.js";
import type { ResolveFieldType } from "./fields.js";
import { createSchemaValuesReconciler, UNCHANGED } from "./reconcile.js";
import {
  setFieldState,
  updateErrors,
  updateFieldErrors,
  type FormState,
} from "./state/index.js";
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
  FORM_FIELDS_STATE_MAP,
  FORM_ID_FROM_PATH,
  internalRegisterFieldPath,
  internalAssignErrors,
  FORM_ROOT_PATH,
  FORM_ERRORS,
  FORM_PATHS_TRIE_REF,
  internalHasFieldState,
} from "./internals.js";
import { FIELD_SUBMITTED } from "./field-state.js";

export const DEFAULT_FIELDS_VALIDATION_DEBOUNCE_MS = 300;

export type InitialErrors =
  | ValidationError[]
  // WARN: This should't be an array
  | Iterable<readonly [FieldPath, string[]]>;

const UI_OPTIONS_REGISTRY_KEY = "uiOptionsRegistry";

export type UiOptionsRegistryOption = keyof UiOptionsRegistry extends never
  ? {
      [UI_OPTIONS_REGISTRY_KEY]?: UiOptionsRegistry;
    }
  : {
      [UI_OPTIONS_REGISTRY_KEY]: UiOptionsRegistry;
    };

function createValueRef(initialValue: FormValue): Ref<FormValue> {
  let value = $state(initialValue);
  return {
    get current() {
      return value;
    },
    set current(v) {
      value = v;
    },
  };
}

export interface IdBuilderFactoryOptions {
  idPrefix: string;
  schema: Schema;
  uiSchema: UiSchemaRoot;
  uiOptionsRegistry: UiOptionsRegistry;
}

export interface ValidatorFactoryOptions {
  idBuilder: FormIdBuilder;
  schema: Schema;
  uiSchema: UiSchemaRoot;
  uiOptionsRegistry: UiOptionsRegistry;
  /**
   * This is a getter that can be used to access the Merger lazily.
   */
  merger: () => FormMerger;
}

export interface MergerFactoryOptions {
  validator: Validator;
  schema: Schema;
  uiSchema: UiSchemaRoot;
  uiOptionsRegistry: UiOptionsRegistry;
}

export interface GetSnapshotOptions {
  validator: Validator;
  merger: FormMerger;
  schema: Schema;
  value: FormValue;
}

export interface FormOptions<T> extends UiOptionsRegistryOption {
  schema: Schema;
  theme: Theme;
  translation: Translation;
  resolver: (ctx: FormState<T>) => ResolveFieldType;
  idBuilder: Creatable<FormIdBuilder, IdBuilderFactoryOptions>;
  validator: Creatable<Validator, ValidatorFactoryOptions>;
  merger: Creatable<FormMerger, MergerFactoryOptions>;
  /**
   * @default DEFAULT_ID_PREFIX
   */
  idPrefix?: string;
  icons?: Icons;
  uiSchema?: UiSchemaRoot;
  extraUiOptions?: ExtraUiOptions;
  fieldsValidationMode?: FieldsValidationMode;
  disabled?: boolean;
  initialValue?: DeepPartial<T>;
  value?: Bind<T>;
  initialErrors?: InitialErrors;
  /**
   * @default waitPrevious
   */
  submissionCombinator?: TasksCombinator<
    [event: SubmitEvent],
    FormValidationResult,
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
    Update<string[]>,
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
  getSnapshot?: (ctx: GetSnapshotOptions) => FormValue;
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
    errors: ValidationError[],
    e: SubmitEvent,
    snapshot: FormValue,
    form: FormState<T>
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

export function createForm<T>(options: FormOptions<T>): FormState<T> {
  // STATE BEGIN
  const idPrefix = $derived(options.idPrefix ?? DEFAULT_ID_PREFIX);
  const uiSchemaRoot = $derived(options.uiSchema ?? {});
  const uiSchema = $derived(resolveUiRef(uiSchemaRoot, options.uiSchema) ?? {});
  const uiOptionsRegistry = $derived(options[UI_OPTIONS_REGISTRY_KEY] ?? {});
  const idBuilder = $derived(
    create(options.idBuilder, {
      idPrefix,
      schema: options.schema,
      uiSchema: uiSchemaRoot,
      uiOptionsRegistry,
    })
  );
  const idCache = new WeakMap<FieldPath, Id>();
  const createId = $derived(
    weakMemoize(idCache, (path) => idBuilder.fromPath(path) as Id)
  );
  const pathsTrieRef: PathTrieRef<FieldPath> = $derived.by(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    options.schema;
    return {
      current: undefined,
    };
  });
  const rootPath = $derived(internalRegisterFieldPath(pathsTrieRef, []));
  const validator = $derived(
    create(options.validator, {
      idBuilder,
      uiSchema: uiSchemaRoot,
      uiOptionsRegistry,
      schema: options.schema,
      merger: (): FormMerger => merger,
    })
  );
  const merger = $derived(
    create(options.merger, {
      validator,
      schema: options.schema,
      uiSchema: uiSchemaRoot,
      uiOptionsRegistry,
    })
  );
  const valueRef = $derived(
    options.value
      ? refFromBind(options.value as unknown as Bind<FormValue>)
      : createValueRef(
          merger.mergeFormDataAndSchemaDefaults({
            formData: options.initialValue as FormValue,
            schema: options.schema,
            initialDefaultsGenerated: false,
          })
        )
  );
  const errors = $derived(
    Array.isArray(options.initialErrors)
      ? internalAssignErrors(
          pathsTrieRef,
          new SvelteMap(),
          options.initialErrors
        )
      : new SvelteMap(options.initialErrors)
  );
  const disabled = $derived(options.disabled ?? false);
  const fieldsValidationMode = $derived(options.fieldsValidationMode ?? 0);
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
    const opts: GetSnapshotOptions = {
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
  const fieldsStateMap = new SvelteMap<FieldPath, number>();
  const isChanged = $derived(fieldsStateMap.size > 0);
  const isSubmitted = $derived(
    internalHasFieldState(fieldsStateMap, rootPath, FIELD_SUBMITTED)
  );
  let isFirstRender = true
  let initialDefaultsGenerated = $derived.by(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    options.schema;
    const result = isFirstRender
    isFirstRender = false
    return result
  });
  // STATE END

  const validateForm: AsyncFormValueValidator["validateFormValueAsync"] =
    $derived.by(() => {
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

  const submission: FormSubmission = createTask({
    async execute(signal) {
      setFieldState(formState, rootPath, FIELD_SUBMITTED);
      const formValue = getSnapshot();
      return {
        formValue,
        formErrors: await validateForm(signal, options.schema, formValue),
      };
    },
    onSuccess({ formValue, formErrors }, event) {
      updateErrors(formState, formErrors);
      if (formErrors.length === 0) {
        options.onSubmit?.(formValue as T, event);
        fieldsStateMap.clear();
        return;
      }
      options.onSubmitError?.(formErrors, event, formValue, formState);
    },
    onFailure(error, e) {
      updateFieldErrors(formState, rootPath, [
        translate("validation-process-error", { error }),
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

  const validateFields: AsyncFieldValueValidator["validateFieldValueAsync"] =
    $derived.by(() => {
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

  const fieldsValidation: FieldsValidation = createTask({
    execute(signal, config, value) {
      const debounceMs = options.fieldsValidationDebounceMs ?? 300;
      if (debounceMs < 0) {
        return validateFields(signal, config, value);
      }

      const promise = Promise.withResolvers<Update<string[]>>();
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
      updateFieldErrors(formState, config.path, fieldErrors);
    },
    onFailure(error, config, value) {
      if (error.reason !== "aborted") {
        updateFieldErrors(formState, config.path, [
          translate("validation-process-error", { error }),
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
    fieldsStateMap.clear();
    errors.clear();
    valueRef.current = merger.mergeFormDataAndSchemaDefaults({
      formData: options.initialValue as FormValue,
      schema: options.schema,
      initialDefaultsGenerated: false,
    });
    options.onReset?.(e);
  }

  const formState: FormState<T> = {
    submission,
    fieldsValidation,
    get value() {
      return getSnapshot() as T | undefined;
    },
    set value(v) {
      valueRef.current = merger.mergeFormDataAndSchemaDefaults({
        formData: v as FormValue,
        schema: options.schema,
        initialDefaultsGenerated: true,
      });
    },
    get isSubmitted() {
      return isSubmitted;
    },
    get isChanged() {
      return isChanged;
    },
    submit,
    reset,
    // INTERNALS
    [FORM_FIELDS_STATE_MAP]: fieldsStateMap,
    get [FORM_ERRORS]() {
      return errors;
    },
    get [FORM_PATHS_TRIE_REF]() {
      return pathsTrieRef;
    },
    get [FORM_ID_FROM_PATH]() {
      return createId;
    },
    get [FORM_ROOT_PATH]() {
      return rootPath;
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
    const nextValue = merger.mergeFormDataAndSchemaDefaults({
      formData: valueRef.current,
      schema: options.schema,
      initialDefaultsGenerated,
    });
    initialDefaultsGenerated = true;
    const change = reconcileSchemaValues(valueRef.current, nextValue);
    if (change !== UNCHANGED) {
      valueRef.current = change;
    }
  }
  return formState;
}

export function handlers<T>(form: FormState<T>): Attachment<HTMLFormElement> {
  return (node) => {
    const disposeSubmit = on(node, "submit", form.submit);
    const disposeReset = on(node, "reset", form.reset);
    return () => {
      disposeReset();
      disposeSubmit();
    };
  };
}
