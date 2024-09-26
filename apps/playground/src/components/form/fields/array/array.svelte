<script lang="ts">
  import { isFixedItems } from "../../schema";
  import { getFormContext } from "../../context";
  import { getUiOptions, getWidgetProps, isFilesArray, isMultiSelect } from "../../utils";

  import type { FieldProps } from "../model";

  import { setArrayContext, type ArrayContext } from "./context";
  import UnsupportedArray from "./unsupported-array.svelte";
  import MultiSelectArray from "./multi-select-array.svelte";
  import FixedArray from "./fixed-array.svelte";
  import FilesArray from "./files-array.svelte";
  import NormalArray from "./normal-array.svelte";

  let {
    name,
    value = $bindable(),
    schema,
    uiSchema,
    idSchema,
    required,
  }: FieldProps<"array"> = $props();

  const ctx = getFormContext();

  const {
    addable = true,
    orderable = true,
    removable = true,
    copyable = false,
  } = $derived(getUiOptions(ctx, uiSchema) ?? {});

  const canAdd = $derived(
    addable &&
      Array.isArray(value) &&
      value.length < (schema.maxItems ?? Infinity)
  );
  // TODO: introduce new `get...Props` function for `array`, `object` and `root` fields
  const widgetProps = $derived(getWidgetProps(ctx, name, schema, uiSchema, idSchema));
  const description = $derived(
    uiSchema["ui:options"]?.description ?? schema.description
  );

  const arrayCtx: ArrayContext = {
    get name() {
      return name;
    },
    get label() {
      return widgetProps.label
    },
    get description() {
      return description;
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
    get disabled() {
      return widgetProps.disabled;
    },
    get readonly() {
      return widgetProps.readonly;
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
