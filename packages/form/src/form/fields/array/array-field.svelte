<script lang="ts">
  import { createKeyedArray } from "@/lib/keyed-array.svelte.js";
  import { isFixedItems, type Schema } from "@/core/index.js";

  import {
    isDisabled,
    getField,
    getErrors,
    getUiOptions,
    isFilesArray,
    isMultiSelect,
    getFormContext,
    validateField,
    getDefaultFieldState,
  } from "../../context/index.js";
  import ErrorMessage from "../../error-message.svelte";
  import { AFTER_SUBMITTED, ON_ARRAY_CHANGE } from "../../validation.js";

  import type { FieldProps } from "../model.js";

  import { setArrayContext, type ArrayContext } from "./context.js";

  let { value = $bindable(), config }: FieldProps<"array"> = $props();

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
  const disabled = $derived(isDisabled(ctx, uiOptions?.input));
  const errors = $derived(getErrors(ctx, config.idSchema));

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

  const [arrayField, field] = $derived.by(() => {
    if (isMultiSelect(ctx, config.schema)) {
      return ["anotherFieldArray", "enum"] as const;
    }
    if (isFixedItems(config.schema)) {
      return ["fixedArray", undefined] as const;
    }
    if (
      isFilesArray(ctx, config.schema) &&
      config.uiOptions?.orderable !== true
    ) {
      return ["anotherFieldArray", "file"] as const;
    }
    return ["normalArray", undefined] as const;
  });

  const ArrayField = $derived(getField(ctx, arrayField, config));
</script>

{#if config.schema.items === undefined}
  <ErrorMessage message={ctx.translation("array-schema-missing-items")} />
{:else}
  <ArrayField bind:value {config} {field} />
{/if}
