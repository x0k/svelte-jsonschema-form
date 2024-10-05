<script lang="ts">
  import { isFixedItems } from "@/core";

  import { getFormContext } from "../../context";
  import { getErrors, getUiOptions, isMultiSelect } from "../../utils";
  import { isDisabledOrReadonly } from "../../is-disabled-or-readonly";

  import { getField, type FieldProps } from "../model";

  import { setArrayContext, type ArrayContext } from "./context";
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
    get errors() {
      return errors;
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

  const [arrayField, field] = $derived.by(() => {
    if (config.schema.items === undefined) {
      return ["unsupportedArray", undefined] as const;
    }
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

<ArrayField bind:value {config} {field} />
