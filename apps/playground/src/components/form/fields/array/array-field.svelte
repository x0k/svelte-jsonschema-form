<script lang="ts">
  import { isFixedItems } from "../../schema";
  import { getFormContext } from "../../context";
  import {
    getUiOptions,
    isMultiSelect,
  } from "../../utils";

  import type { FieldProps } from "../model";
  import { isDisabledOrReadonly } from '../is-disabled-or-readonly'
  
  import { setArrayContext, type ArrayContext } from "./context";
  import UnsupportedArray from "./unsupported-array.svelte";
  import MultiSelectArray from "./multi-select-array.svelte";
  import FixedArray from "./fixed-array.svelte";
  import FilesArray from "./files-array.svelte";
  import NormalArray from "./normal-array.svelte";
  
  import { isFilesArray } from './is-files-array'

  let {
    name,
    value = $bindable(),
    schema,
    uiSchema,
    idSchema,
    required,
  }: FieldProps<"array"> = $props();

  const ctx = getFormContext();

  const uiOptions = $derived(getUiOptions(ctx, uiSchema));
  const {
    addable = true,
    orderable = true,
    removable = true,
    copyable = false,
  } = $derived(uiOptions ?? {});

  const canAdd = $derived(
    addable &&
      Array.isArray(value) &&
      (schema.maxItems === undefined || value.length < schema.maxItems)
  );
  const disabledOrReadonly = $derived(
    isDisabledOrReadonly(ctx, uiOptions?.input)
  );

  const arrayCtx: ArrayContext = {
    get name() {
      return name;
    },
    get uiOptions() {
      return uiOptions;
    },
    get value() {
      return value;
    },
    set value(v) {
      value = v;
    },
    get schema() {
      return schema;
    },
    get uiSchema() {
      return uiSchema;
    },
    get idSchema() {
      return idSchema;
    },
    get required() {
      return required;
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

{#if schema.items === undefined}
  <UnsupportedArray />
{:else if isMultiSelect(ctx, schema)}
  <MultiSelectArray />
  <!-- {:else if isCustomWidget(uiSchema)} -->
{:else if isFixedItems(schema)}
  <FixedArray />
{:else if isFilesArray(ctx, schema)}
  <FilesArray />
{:else}
  <NormalArray />
{/if}
