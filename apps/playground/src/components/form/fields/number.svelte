<script lang="ts">
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

  let proxyValue = $state(value === undefined ? undefined : String(value));

  $effect(() => {
    value = Number(proxyValue);
  });

  const Field = $derived(getField(ctx, "string", uiSchema));
</script>

<Field
  bind:value={proxyValue}
  {name}
  {schema}
  {uiSchema}
  {idSchema}
  {required}
/>
