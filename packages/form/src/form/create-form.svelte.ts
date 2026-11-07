import type { Attachment } from "svelte/attachments";
import { on } from "svelte/events";
import { SvelteMap } from "svelte/reactivity";

import {
  DEPENDENCIES_KEY,
  IF_KEY,
  isSchemaDeepEqual,
  retrieveSchema,
  sanitizeDataForNewSchema,
  schemaHasNestedConditional,
  type Schema,
  type Validator,
} from "#core/index.js";
import { createDataURLtoBlob } from "#lib/file.js";
import { weakMemoize } from "#lib/memoize.js";
import type { SchedulerYield } from "#lib/scheduler.js";
import {
  abortPrevious,
  createTask,
  type TasksCombinator,
  type FailedTask,
  debounce,
} from "#lib/task.svelte.js";
import type { DeepPartial } from "#lib/types.js";

import { pathKey } from "./change-path.js";
import type { Theme } from "./components.js";
import type { Config } from "./config.js";
import { rebuildOldFormData } from "./drop-stale-defaults.js";
import type { FieldsValidation, FormValidation } from "./errors.js";
import type { ResolveFieldType } from "./fields.js";
import type { Icons } from "./icons.js";
import {
  DEFAULT_ID_PREFIX,
  type FieldPath,
  type FormIdBuilder,
  type Id,
} from "./id.js";
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
  FORM_ROOT_PATH,
  FORM_ERRORS,
  FORM_PATHS_TRIE_REF,
  FORM_ID_PREFIX,
  FormErrors,
  FORM_RETRIEVED_SCHEMA,
  FORM_CONFIGS_CACHE,
  FORM_ID_BUILDER,
  FORM_INITIAL_DEFAULTS_GENERATED,
  FORM_INITIAL_VALUE,
} from "./internals.js";
import type { FormMerger, FormValueChange } from "./merger.js";
import {
  create,
  type Creatable,
  type FieldValue,
  type FormValue,
  type FormValueRef,
  type KeyedArraysMap,
  type RegisteredPathTrieRef,
  type Update,
} from "./model.js";
import { createFormValueReconciler } from "./reconcile.js";
import { StaleDefaultsPass } from "./stale-defaults-pass.js";
import {
  getStaleDefaultsTriggerKeys,
  type StaleDefaultsTriggerKeys,
} from "./stale-defaults-trigger.js";
import {
  reset,
  updateErrors,
  updateFieldErrors,
  validate,
  type FormState,
  type ValidateHandlers,
} from "./state/index.js";
import { createTranslate, type Translation } from "./translation.js";
import {
  resolveUiRef,
  type ExtraUiOptions,
  type UiOptionsRegistry,
  type UiSchemaRoot,
} from "./ui-schema.js";
import type { FieldsValidationMode } from "./validation.js";
import {
  isFieldValueValidator,
  isAsyncFieldValueValidator,
  type AsyncFormValueValidator,
  type AsyncFieldValueValidator,
  type ValidationError,
  type ValidationResult,
  type FormValidator,
} from "./validator.js";
import { createFormValueStore } from "./value-store.js";

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

function createValueRef(initialValue: FormValue): FormValueRef {
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
  validator: Validator;
  merger: FormMerger;
  valueRef: FormValueRef;
}

export interface ValidatorFactoryOptions {
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

export interface FormOptions<T>
  extends ValidateHandlers<T, FailedTask<unknown>>, UiOptionsRegistryOption {
  schema: Schema;
  theme: Theme;
  translation: Translation;
  resolver: (ctx: FormState<T>) => ResolveFieldType;
  idBuilder: Creatable<FormIdBuilder, IdBuilderFactoryOptions>;
  validator: Creatable<FormValidator<T>, ValidatorFactoryOptions>;
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
  initialErrors?: InitialErrors;
  /**
   * @default waitPrevious
   */
  validationCombinator?: TasksCombinator<
    [FormValue],
    ValidationResult<T>,
    unknown
  >;
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
   * Field validation error handler
   */
  onFieldsValidationProcessError?: (
    state: FailedTask<unknown>,
    config: Config,
    value: FormValue
  ) => void;
  schedulerYield?: SchedulerYield;
}

export function createForm<T>(options: FormOptions<T>): FormState<T> {
  // STATE BEGIN
  const idPrefix = $derived(options.idPrefix ?? DEFAULT_ID_PREFIX);
  const uiSchemaRoot = $derived(options.uiSchema ?? {});
  const uiSchema = $derived(resolveUiRef(uiSchemaRoot, options.uiSchema) ?? {});
  const uiOptionsRegistry = $derived(options[UI_OPTIONS_REGISTRY_KEY] ?? {});
  const pathsTrieRef: RegisteredPathTrieRef<FieldPath> = $derived.by(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    options.schema;
    return {
      current: undefined,
      registered: new WeakSet(),
    };
  });
  const rootPath = $derived(internalRegisterFieldPath(pathsTrieRef, []));
  const validator = $derived(
    create(options.validator, {
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
    createValueRef(
      merger.mergeFormDataAndSchemaDefaults({
        formData: options.initialValue as FormValue,
        schema: options.schema,
      })
    )
  );
  // The stale-default search needs to know which values the user wrote and what
  // they replaced, so it can resolve the old schema without cloning form data.
  // A path is stored once: replaying writes from latest to earliest keeps the
  // first old value, so later writes to the same path add nothing.
  const pendingChanges = new Map<string, FormValueChange>();
  // A reactive `initialValue` recreates `valueRef`, reseeding the form value
  // like a reset, so history recorded against the previous ref no longer
  // applies.
  let pendingChangesRef: FormValueRef | undefined;
  const idBuilder: FormIdBuilder = $derived(
    create(options.idBuilder, {
      idPrefix,
      schema: options.schema,
      uiSchema: uiSchemaRoot,
      uiOptionsRegistry,
      merger: merger,
      validator: validator,
      valueRef,
    })
  );
  const retrievedSchema = $derived(
    retrieveSchema(
      validator,
      merger,
      options.schema,
      options.schema,
      valueRef.current
    )
  );
  // A `dependencies`/`if` branch switch nested inside an object property never changes the ROOT retrieved
  // schema (only the schema's own top-level `dependencies`/`if` get resolved into it), so comparing
  // retrieved schemas below can't detect it (#5250). When the schema has such a nested conditional,
  // sanitization must still be attempted.
  const hasNestedConditionalSchema = $derived(
    schemaHasNestedConditional(options.schema)
  );
  // Only dependency and conditional branches can swap a declared default.
  // `schemaHasNestedConditional` deliberately ignores the schema's own
  // top-level keywords, so the root has to be checked separately.
  const mayDropStaleDefaults = $derived(
    hasNestedConditionalSchema ||
      DEPENDENCIES_KEY in options.schema ||
      IF_KEY in options.schema
  );
  // The defaults pass is only needed when a change can swap a conditional
  // branch. Recording every change is still required to tell user edits from
  // untouched defaults, but scheduling the (linear) pass for unrelated fields
  // made ordinary typing O(form size).
  const staleDefaultsTriggerKeys: StaleDefaultsTriggerKeys = $derived(
    getStaleDefaultsTriggerKeys(options.schema)
  );
  const idCache = new WeakMap<FieldPath, Id>();
  const idFromPath = $derived(
    weakMemoize(idCache, (path) => idBuilder.fromPath(path) as Id)
  );
  const errors = $derived.by(() => {
    const errors = new FormErrors(pathsTrieRef);
    const initial = options.initialErrors;
    if (initial === undefined) {
      return errors;
    }
    return Array.isArray(initial)
      ? errors.updateErrors(initial)
      : errors.assign(initial);
  });
  const disabled = $derived(options.disabled ?? false);
  const fieldsValidationMode = $derived(options.fieldsValidationMode ?? 0);
  const keyedArrays: KeyedArraysMap = new WeakMap();
  const reconcileFormValue = $derived(
    createFormValueReconciler({
      keyedArraysMap: keyedArrays,
      valueComparer: merger,
    })
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
  const translate = $derived(createTranslate(options.translation));
  const fieldsStateMap = new SvelteMap<FieldPath, number>();
  let isFirstRender = true;
  let initialDefaultsGenerated = $derived.by(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    options.schema;
    const result = isFirstRender;
    isFirstRender = false;
    return result;
  });
  // STATE END

  const validateForm: AsyncFormValueValidator<T>["validateFormValueAsync"] =
    $derived.by(() => {
      if ("validateFormValueAsync" in validator) {
        return (signal, formValue) =>
          validator.validateFormValueAsync(signal, formValue);
      }
      return (_, formValue) =>
        Promise.resolve(validator.validateFormValue(formValue));
    });

  const validation: FormValidation<T> = createTask({
    async execute(signal, value) {
      return await validateForm(signal, value);
    },
    onSuccess(result) {
      updateErrors(formState, result.errors ?? []);
      if (result.errors === undefined) {
        options.onValid?.(result.value);
        fieldsStateMap.clear();
        return;
      }
      options.onInvalid?.(result);
    },
    onFailure(error) {
      updateFieldErrors(formState, rootPath, [
        translate("validation-process-error", { error }),
      ]);
      options.onValidationProcessError?.(error);
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

  const validateFields = $derived.by<
    AsyncFieldValueValidator["validateFieldValueAsync"]
  >(() => {
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
    execute: debounce(
      // To maintain reactivity
      (s, c, v) => validateFields(s, c, v),
      () => options.fieldsValidationDebounceMs ?? 300
    ),
    onSuccess(fieldErrors, config) {
      updateFieldErrors(formState, config.path, fieldErrors);
    },
    onFailure(error, config, value) {
      if (error.reason !== "aborted") {
        updateFieldErrors(formState, config.path, [
          translate("validation-process-error", { error }),
        ]);
      }
      options.onFieldsValidationProcessError?.(error, config, value);
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

  const valueStore = createFormValueStore({
    // `valueRef` may be recreated when the schema or initial value changes, so
    // the store reads through a stable ref instead of capturing the first one.
    valueRef: {
      get current() {
        return valueRef.current;
      },
      set current(v) {
        valueRef.current = v;
      },
    },
    keyedArrays,
    onChange(change) {
      recordChange(change.path, change.oldValue);
    },
    onReplace() {
      pendingChanges.clear();
      pendingChangesRef = valueRef;
    },
  });

  const formState: FormState<T> = {
    validation,
    fieldsValidation,
    // INTERNALS
    [FORM_FIELDS_STATE_MAP]: fieldsStateMap,
    [FORM_CONFIGS_CACHE]: new WeakMap(),
    get [FORM_INITIAL_VALUE]() {
      return options.initialValue;
    },
    get [FORM_INITIAL_DEFAULTS_GENERATED]() {
      return initialDefaultsGenerated;
    },
    set [FORM_INITIAL_DEFAULTS_GENERATED](v) {
      initialDefaultsGenerated = v;
    },
    get [FORM_ID_PREFIX]() {
      return idPrefix;
    },
    get [FORM_ERRORS]() {
      return errors;
    },
    get [FORM_PATHS_TRIE_REF]() {
      return pathsTrieRef;
    },
    get [FORM_ID_FROM_PATH]() {
      return idFromPath;
    },
    get [FORM_ROOT_PATH]() {
      return rootPath;
    },
    [FORM_VALUE]: valueStore,
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
    get [FORM_RETRIEVED_SCHEMA]() {
      return retrievedSchema;
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
    get [FORM_ID_BUILDER]() {
      return idBuilder;
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
    [FORM_MARK_SCHEMA_CHANGE]: scheduleDefaultsInjection,
  };
  const fieldTypeResolver = $derived(options.resolver(formState));

  function recordChange(path: FieldPath, oldValue: FieldValue) {
    if (!mayDropStaleDefaults) {
      return;
    }
    if (pendingChangesRef !== valueRef) {
      pendingChanges.clear();
      pendingChangesRef = valueRef;
    }
    const key = pathKey(path);
    if (!pendingChanges.has(key)) {
      pendingChanges.set(key, { path, oldValue });
    }
    const triggerKeys = staleDefaultsTriggerKeys;
    if (triggerKeys === undefined || mayChangeTriggerKey(path, triggerKeys)) {
      scheduleDefaultsInjection();
    }
  }
  function takePendingChanges() {
    if (pendingChangesRef !== valueRef) {
      pendingChanges.clear();
      pendingChangesRef = valueRef;
    }
    const changes = [...pendingChanges.values()];
    pendingChanges.clear();
    return changes;
  }
  // A `dependencies` key counts when it is the first path segment (or part of
  // a root array item path); a nested conditional is attributed to the
  // top-level property that contains it.
  function mayChangeTriggerKey(
    path: FieldPath,
    triggerKeys: ReadonlySet<string>
  ) {
    for (const part of path) {
      if (typeof part === "string") {
        return triggerKeys.has(part);
      }
    }
    // Replacing the whole value, or an item of a root-level array, can change
    // any condition.
    return true;
  }
  let isDefaultsInjectionQueued = false;
  function scheduleDefaultsInjection() {
    if (isDefaultsInjectionQueued) return;
    isDefaultsInjectionQueued = true;
    queueMicrotask(injectSchemaDefaults);
  }
  function injectSchemaDefaults() {
    isDefaultsInjectionQueued = false;
    const changes = takePendingChanges();
    let formData = valueRef.current;
    // The schema the data arrived under is resolved for the data before the
    // pending changes, not for the last schema the derived happened to see: a
    // `markSchemaChange` injection can follow one that has already moved the
    // data to the new schema, and sanitizing it then from the schema of an
    // earlier value would clear what that pass just wrote.
    const oldFormData = rebuildOldFormData(formData, changes);
    let currentRetrievedSchema = retrieveSchema(
      validator,
      merger,
      options.schema,
      options.schema,
      oldFormData
    );
    // The old side is fixed for the whole pass. Later iterations have already
    // dropped values the search must still see on the old side, so rebuilding
    // it from `changes` on each search would lose them.
    const staleDefaultsPass =
      mayDropStaleDefaults && changes.length > 0
        ? new StaleDefaultsPass({
            validator,
            merger,
            rootSchema: options.schema,
            changes,
            oldFormData,
            oldSchema: currentRetrievedSchema,
          })
        : undefined;
    const values: FormValue[] = [];

    sanitization: while (true) {
      // Remove a swapped-away branch's default before the fill, so the fill sees
      // the newly selected branch's declaration in this same iteration. The
      // search runs on every sanitizing iteration: replacing one key's default
      // can select a different branch for another key one hop later.
      if (staleDefaultsPass) {
        const newRetrievedSchema = retrieveSchema(
          validator,
          merger,
          options.schema,
          options.schema,
          formData
        );
        formData = staleDefaultsPass.drop(formData, newRetrievedSchema);
      }
      formData = merger.mergeFormDataAndSchemaDefaults({
        formData: formData,
        schema: options.schema,
        initialDefaultsGenerated,
      });
      initialDefaultsGenerated = true;

      let hasNewRefill = false;
      if (staleDefaultsPass) {
        const afterFill = staleDefaultsPass.afterFill(formData);
        formData = afterFill.formData;
        hasNewRefill = afterFill.hasNewRefill;
      }

      // A replacement the fill has just written was not seen by the fill that
      // wrote it: that fill ran with the key deleted. Give the key's own
      // conditionals one more pass over the value that is really there.
      if (!hasNewRefill) {
        for (let i = values.length - 1; i >= 0; i--) {
          if (merger.isValueDeepEqual(values[i], formData)) {
            break sanitization;
          }
        }
      }

      const nextRetrievedSchema = retrieveSchema(
        validator,
        merger,
        options.schema,
        options.schema,
        formData
      );

      if (
        !hasNewRefill &&
        !hasNestedConditionalSchema &&
        isSchemaDeepEqual(currentRetrievedSchema, nextRetrievedSchema)
      ) {
        break sanitization;
      }

      values.push(formData);
      const dataBeforeSanitize = formData;
      formData = sanitizeDataForNewSchema(
        validator,
        merger,
        options.schema,
        nextRetrievedSchema,
        currentRetrievedSchema,
        formData
      );
      if (staleDefaultsPass) {
        formData = staleDefaultsPass.afterSanitize(
          formData,
          dataBeforeSanitize,
          nextRetrievedSchema
        );
      }
      currentRetrievedSchema = nextRetrievedSchema;
    }

    if (staleDefaultsPass) {
      formData = staleDefaultsPass.restoreUnfilled(formData);
    }

    reconcileFormValue(valueRef, formData);
  }

  return formState;
}

export function handlers<T>(form: FormState<T>): Attachment<HTMLFormElement> {
  return (node) => {
    const disposeSubmit = on(node, "submit", (e) => {
      e.preventDefault();
      void validate(form);
    });
    const disposeReset = on(node, "reset", (e) => {
      e.preventDefault();
      reset(form);
    });
    return () => {
      disposeReset();
      disposeSubmit();
    };
  };
}
