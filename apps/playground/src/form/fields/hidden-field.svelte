<script lang="ts">
  import { getFormContext } from "../context";
  
  import type { FieldProps } from "./model";
  import { inputAttributes } from "./make-widget-attributes";

  const { config, value = $bindable() }: FieldProps<"hidden"> = $props();

  const ctx = getFormContext();
</script>

<input {value} {...inputAttributes(ctx, config)} type="hidden" />
