<script lang="ts">
  import { getFormContext } from "../context.js";
  
  import type { FieldProps } from "./model.js";
  import { inputAttributes } from "./make-widget-attributes.js";

  const { config, value = $bindable() }: FieldProps<"hidden"> = $props();

  const ctx = getFormContext();
</script>

<input {value} {...inputAttributes(ctx, config)} type="hidden" />
