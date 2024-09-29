<script lang="ts">
  import { createTransformation } from "@/lib/svelte.svelte";

  import { getFormContext } from "../context";

  import { getField, type FieldProps } from "./model";

  let { value = $bindable(), config }: FieldProps<"integer"> = $props();

  const ctx = getFormContext();

  const Field = $derived(getField(ctx, "number", config));

  const transformation = createTransformation({
    transform: () => value,
    guard: (v) => Number.isInteger(v) || v === null,
    update: (v) => {
      value = v;
    },
  });
</script>

<Field bind:value={transformation.value} {config} />
