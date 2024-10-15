<script lang="ts">
  import { isFixedItems } from "@/core/index.js";

  import { getFormContext } from "../../context.js";
  import { getErrors, getUiOptions, isMultiSelect } from "../../utils.js";
  import { isDisabled } from "../../is-disabled.js";
  import ErrorMessage from "../../error-message.svelte";

  import { getField, type FieldProps } from "../model.js";

  import { setArrayContext, type ArrayContext } from "./context.js";
  import { isFilesArray } from "./is-files-array.js";

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
  const disabled = $derived(
    isDisabled(ctx, uiOptions?.input)
  );
  const errors = $derived(getErrors(ctx, config.idSchema));

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
