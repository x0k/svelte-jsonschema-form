<script lang="ts">
  import { isFixedItems } from "../../schema";
  import { getFormContext } from "../../context";
  import { isFilesArray, isMultiSelect } from "../../utils";

  import type { FieldProps } from "../model";

  import { setArrayContext, type ArrayContext } from "./context";
  import FilesArray from "./files-array.svelte";
  import FixedArray from "./fixed-array.svelte";
  import MultiSelectArray from "./multi-select-array.svelte";
  import NormalArray from "./normal-array.svelte";
  import Unsupported from "./unsupported-array.svelte";

  let {
    name,
    value = $bindable(),
    schema,
    uiSchema,
    idSchema,
    required,
  }: FieldProps<"array"> = $props();

  const ctx = getFormContext();

  const arrayCtx: ArrayContext = {
    get name() {
      return name;
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
  };
  setArrayContext(arrayCtx);

  const schemaItems = $derived(schema.items);
</script>

{#if schemaItems === undefined}
  <Unsupported />
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
