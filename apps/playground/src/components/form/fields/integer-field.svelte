<script lang="ts">
  import { proxy } from "@/lib/svelte.svelte";

  import { getFormContext } from "../context";

  import { getField, type FieldProps } from "./model";

  let { value = $bindable(), config }: FieldProps<"integer"> = $props();

  const ctx = getFormContext();

  const Field = $derived(getField(ctx, "number", config));

  const integer = proxy(() => value, {
    guard: (v) => Number.isInteger(v) || v === config.uiOptions?.emptyValue,
    update: (v) => {
      value = v;
    },
  });
</script>

<Field bind:value={integer.value} {config} />
