<script lang="ts">
  import { getFormContext } from "../context";
  import { getField } from "../utils";

  import type { FieldProps } from "./model";

  const ctx = getFormContext();

  const {
    name,
    value,
    onChange,
    schema,
    idSchema,
    uiSchema,
    required,
  }: FieldProps<"number"> = $props();

  let proxyValue = $state<string>();

  $effect(() => {
    proxyValue = value === undefined ? undefined : String(value);
  });

  const Field = $derived(getField(ctx, "string", uiSchema));
</script>

<Field
  value={proxyValue}
  onChange={(v) => {
    proxyValue = v;
    onChange(Number(v));
  }}
  {name}
  {schema}
  {uiSchema}
  {idSchema}
  {required}
/>
