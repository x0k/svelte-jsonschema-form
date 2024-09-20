<script lang="ts">
  import { getFormContext } from "../context";
  import { getLabel, getWidget } from "../utils";

  import type { FieldProps } from "./model";

  const ctx = getFormContext();
  let {
    value = $bindable(),
    schema,
    uiSchema,
    idSchema,
  }: FieldProps<"string"> = $props();
  const Widget = $derived(getWidget(ctx, "text", uiSchema));
  const label = $derived(getLabel(schema, uiSchema));
</script>

<Widget id={idSchema.$id} bind:value {schema} {uiSchema} {label} />
