<script lang="ts">
  import { createKeyedArray } from "@/lib/keyed-array.svelte";
  import {
    isFixedItems,
    isSchemaObjectValue,
    type Schema,
    type Validator,
  } from "@/core/index.js";
  import {
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
    translate,
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
  const errors = $derived(getErrors(ctx, config.id));

  function validate() {
    const m = ctx.fieldsValidationMode;
    if (!(m & ON_ARRAY_CHANGE) || (m & AFTER_SUBMITTED && !ctx.isSubmitted)) {
      return;
    }
    validateField(ctx, config, value);
  }

  const keyedArray = createKeyedArray(() => value ?? []);

  // NOTE: Defining this component as a generic will break packaging
  // dependant packages
  const arrayCtx: ArrayContext<Validator> = {
    get errors() {
      return errors;
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
</script>

{#if config.schema.items === undefined}
  <ErrorMessage message={translate(ctx, "array-schema-missing-items", {})} />
{:else if isFixedItems(config.schema)}
  {@const Field = getComponent(ctx, "fixedArrayField", config)}
  <Field {config} bind:value />
{:else}
  {@const Field = getComponent(ctx, "normalArrayField", config)}
  <Field {config} bind:value />
{/if}
