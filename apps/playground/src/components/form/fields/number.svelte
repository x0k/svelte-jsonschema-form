<script lang="ts">
  import { createTransformation } from "@/lib/svelte.svelte";

  import { getFormContext } from "../context";
  import { getField } from "../utils";

  import type { FieldProps } from "./model";

  const ctx = getFormContext();

  let {
    name,
    value = $bindable(),
    schema,
    idSchema,
    uiSchema,
    required,
  }: FieldProps<"number"> = $props();

  const transformation = createTransformation({
    input: () => value,
    transform: (value) => (value === undefined ? undefined : String(value)),
    update: (v) => {
      value = Number(v);
    },
  });

  const Field = $derived(getField(ctx, "string", uiSchema));
</script>

<Field
  bind:value={transformation.value}
  {name}
  {schema}
  {uiSchema}
  {idSchema}
  {required}
/>
