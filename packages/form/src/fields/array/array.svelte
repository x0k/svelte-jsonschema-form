<script lang="ts" module>
  declare module "@/form/index.js" {
    interface UiOptions {
      array?: {
        disabled?: boolean;
      };
    }
  }
</script>

<script lang="ts">
  import { createKeyedArray } from "@/lib/keyed-array.svelte.js";
  import {
    isFixedItems,
    isSchemaObjectValue,
    type Schema,
  } from "@/core/index.js";
  import {
    isDisabled,
    getErrors,
    getUiOptions,
    isFilesArray,
    isMultiSelect,
    getFormContext,
    validateField,
    getDefaultFieldState,
    ErrorMessage,
    AFTER_SUBMITTED,
    ON_ARRAY_CHANGE,
    getComponent,
    type ComponentProps,
  } from "@/form/index.js";

  import { setArrayContext, type ArrayContext } from "./context.js";

  let { value = $bindable(), config }: ComponentProps["arrayField"] = $props();

  const ctx = getFormContext();

  const uiOptions = $derived(getUiOptions(ctx, config.uiSchema));
  const {
    addable = true,
    orderable = true,
    removable = true,
    copyable = false,
  } = $derived(uiOptions ?? {});

  const canAdd = $derived(
    addable &&
      Array.isArray(value) &&
      (config.schema.maxItems === undefined ||
        value.length < config.schema.maxItems)
  );
  const disabled = $derived(isDisabled(ctx, uiOptions?.array));
  const errors = $derived(getErrors(ctx, config.id));

  function validate() {
    const m = ctx.fieldsValidationMode;
    if (!(m & ON_ARRAY_CHANGE) || (m & AFTER_SUBMITTED && !ctx.isSubmitted)) {
      return;
    }
    validateField(ctx, config, value);
  }

  const keyedArray = createKeyedArray(() => value ?? []);

  const arrayCtx: ArrayContext = {
    get errors() {
      return errors;
    },
    get disabled() {
      return disabled;
    },
    get canAdd() {
      return canAdd;
    },
    get addable() {
      return addable;
    },
    get orderable() {
      return orderable;
    },
    get removable() {
      return removable;
    },
    get copyable() {
      return copyable;
    },
    validate,
    key(index) {
      return keyedArray.key(index);
    },
    pushItem(itemSchema: Schema) {
      keyedArray.push(getDefaultFieldState(ctx, itemSchema, undefined));
      validate();
    },
    moveItemUp(index) {
      keyedArray.swap(index, index - 1);
      validate();
    },
    moveItemDown(index) {
      keyedArray.swap(index, index + 1);
      validate();
    },
    copyItem(index) {
      keyedArray.insert(index, $state.snapshot(value![index]));
      validate();
    },
    removeItem(index) {
      keyedArray.remove(index);
      validate();
    },
  };
  setArrayContext(arrayCtx);

  const itemSchema: Schema = $derived(
    isSchemaObjectValue(config.schema.items) ? config.schema.items : {}
  );
</script>

{#if config.schema.items === undefined}
  <ErrorMessage message={ctx.translation("array-schema-missing-items")} />
{:else if isMultiSelect(ctx, config.schema)}
  {@const Field = getComponent(ctx, "multiEnumField", config)}
  <Field {config} {itemSchema} bind:value />
{:else if isFixedItems(config.schema)}
  {@const Field = getComponent(ctx, "fixedArrayField", config)}
  <Field {config} bind:value />
{:else if isFilesArray(ctx, config.schema) && config.uiOptions?.orderable !== true}
  {@const Field = getComponent(ctx, "filesField", config)}
  <!-- TODO: Add runtime check in dev env -->
  <Field {config} bind:value={() => value as string[], (v) => (value = v)} />
{:else}
  {@const Field = getComponent(ctx, "normalArrayField", config)}
  <Field {config} bind:value />
{/if}
