import { SvelteMap } from "svelte/reactivity";

import type { SchedulerYield } from "@/lib/scheduler.js";
import type { Schema, SchemaValue } from "@/core/schema.js";

import type { FormValidator } from "./validator.js";
import type { Components } from "./component.js";
import type { Widgets } from "./widgets.js";
import type { Translation } from "./translation.js";
import { DefaultFormMerger, type FormMerger } from "./merger.js";
import type { UiSchemaRoot } from "./ui-schema.js";
import type { Fields } from "./fields/index.js";
import type { Templates } from "./templates/index.js";
import type { Icons } from "./icons.js";
import type { InputsValidationMode } from "./validation.js";
import type { Errors } from "./errors.js";
import type { FormContext } from "./context/index.js";

import { fields as defaultFields } from "./fields/index.js";
import { templates as defaultTemplates } from "./templates/index.js";
import { DEFAULT_ID_PREFIX, DEFAULT_ID_SEPARATOR } from "./id-schema.js";
import type { ComponentInternals, Snippet } from 'svelte';

export interface Options<T, E> {
  validator: FormValidator;
  schema: Schema;
  uiSchema?: UiSchemaRoot;
  components: Components;
  translation: Translation;
  widgets: Widgets;
  merger?: FormMerger;
  fields?: Fields;
  templates?: Templates;
  icons?: Icons;
  inputsValidationMode?: InputsValidationMode;
  disabled?: boolean;
  idPrefix?: string;
  idSeparator?: string;
  //
  initialElement?: HTMLFormElement;
  initialValue?: T;
  initialErrors?: Errors<E>;
  /**
   * The function to get the form data snapshot
   *
   * The snapshot is used to validate the form and passed to
   * `onSubmit` and `onSubmitError` handlers.
   *
   * @default () => $state.snapshot(value)
   */
  getSnapshot?: () => SchemaValue | undefined;
  /**
   * Submit handler
   *
   * Will be called when the form is submitted and form data
   * snapshot is valid
   */
  onSubmit?: (value: T | undefined, e: SubmitEvent) => void;
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
   * Reset handler
   *
   * Will be called on form reset.
   *
   * By default it will clear the errors and set `isSubmitted` state to `false`.
   *
   * @default () => { isSubmitted = false; errors.clear() }
   */
  onReset?: (e: Event) => void;
  schedulerYield?: SchedulerYield;
}

export function useForm<T, E>(options: Options<T, E>) {
  let element = $state(options.initialElement);
  let value = $state(options.initialValue);
  let errors: Errors<E> = $state(options.initialErrors ?? new SvelteMap());
  let isSubmitted = $state(false);

  const resetHandler = $derived(
    options.onReset ??
      (() => {
        isSubmitted = false;
        errors.clear();
      })
  );
  $effect(() => {
    if (element === undefined) {
      return;
    }
    const handler = resetHandler;
    element.addEventListener("reset", handler);
    return () => {
      element.removeEventListener("reset", handler);
    };
  });

  const merger = $derived(
    options.merger ?? new DefaultFormMerger(options.validator, options.schema)
  );

  const inputsValidationMode = $derived(options.inputsValidationMode ?? 0);
  const uiSchema = $derived(options.uiSchema ?? {});
  const disabled = $derived(options.disabled ?? false);
  const idPrefix = $derived(options.idPrefix ?? DEFAULT_ID_PREFIX);
  const idSeparator = $derived(options.idSeparator ?? DEFAULT_ID_SEPARATOR);
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

  const ctx: FormContext = {
    get inputsValidationMode() {
      return options.inputsValidationMode ?? 0;
    },
    get isSubmitted() {
      return isSubmitted;
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
  };
}