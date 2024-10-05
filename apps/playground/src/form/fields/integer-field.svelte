<script lang="ts">
  import { getFormContext } from "../context";

  import { getField, type FieldProps } from "./model";

  let { value = $bindable(), config }: FieldProps<"integer"> = $props();

  const ctx = getFormContext();

  const Field = $derived(getField(ctx, "number", config));

  const integer = {
    get value() {
      return value;
    },
    set value(v) {
      if (!Number.isInteger(v) && v !== config.uiOptions?.emptyValue) {
        return
      }
      value = v;
    }
  }
</script>

<Field bind:value={integer.value} {config} />
