<script lang="ts">
  import { getComponent, getFormContext } from "@/form/index.js";

  import type { FieldProps } from './fields.js';

  let { value = $bindable(), config }: FieldProps<"integer"> = $props();

  const ctx = getFormContext();

  const Field = $derived(getComponent(ctx, "numberField", config));

  const integer = {
    get value() {
      return value;
    },
    set value(v) {
      if (!Number.isInteger(v) && v !== config.uiOptions?.emptyValue) {
        return;
      }
      value = v;
    },
  };
</script>

<Field bind:value={integer.value} {config} />
