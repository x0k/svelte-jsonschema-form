<script lang="ts">
  import { isFixedItems } from "../../schema";
  import { getFormContext } from "../../context";
  import { getErrors, getUiOptions, isMultiSelect } from "../../utils";

  import type { FieldProps } from "../model";
  import { isDisabledOrReadonly } from "../is-disabled-or-readonly";

  import { setArrayContext, type ArrayContext } from "./context";
  import UnsupportedArray from "./unsupported-array.svelte";
  import OtherFieldArray from "./other-field-array.svelte";
  import FixedArray from "./fixed-array.svelte";
  import NormalArray from "./normal-array.svelte";

  import { isFilesArray } from "./is-files-array";

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
  const disabledOrReadonly = $derived(
    isDisabledOrReadonly(ctx, uiOptions?.input)
  );
  const errors = $derived(getErrors(ctx, config.idSchema));

  const arrayCtx: ArrayContext = {
    get value() {
      return value;
    },
    set value(v) {
      value = v;
    },
    get errors() {
      return errors;
    },
    get config() {
      return config;
    },
    get disabledOrReadonly() {
      return disabledOrReadonly;
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
</script>

{#if config.schema.items === undefined}
  <UnsupportedArray />
{:else if isMultiSelect(ctx, config.schema)}
  <OtherFieldArray field="enum" />
  <!-- {:else if isCustomWidget(uiSchema)} -->
{:else if isFixedItems(config.schema)}
  <FixedArray />
{:else if isFilesArray(ctx, config.schema) && config.uiOptions?.orderable !== true}
  <OtherFieldArray field="file" />
{:else}
  <NormalArray />
{/if}
