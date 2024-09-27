<script lang="ts">
  import { createTransformation } from "@/lib/svelte.svelte";

  import { getFormContext } from "../context";
  import { getField } from "../utils";

  import type { FieldProps } from "./model";

  const ctx = getFormContext();

  let {
    value = $bindable(),
    uiSchema,
    ...rest
  }: FieldProps<"integer"> = $props();

  const Field = $derived(getField(ctx, "number", uiSchema));

  const transformation = createTransformation({
    transform: () => value,
    guard: (v) => Number.isInteger(v) || v === null,
    update: (v) => {
      value = v;
    },
  });
</script>

<Field {...rest} bind:value={transformation.value} {uiSchema} />
