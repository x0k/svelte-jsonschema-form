<script lang="ts">
  import { getFormContext } from "../context";
  import { getUiOptions } from "../utils";

  import type { FieldProps } from "./model";
  import { inputAttributes } from "./make-widget-attributes";

  const {
    value = $bindable(),
    uiSchema,
    idSchema,
  }: FieldProps<"hidden"> = $props();

  const ctx = getFormContext();

  const uiOptions = $derived(getUiOptions(ctx, uiSchema));
</script>

<input
  id={idSchema.$id}
  name={idSchema.$id}
  type="hidden"
  {value}
  {...inputAttributes(uiOptions?.input)}
/>
