<script lang="ts">
  import type { FieldProps } from "./model";
  import { inputAttributes } from "./make-widget-attributes";
  import { getFormContext } from "../context";

  const { config, value = $bindable() }: FieldProps<"hidden"> = $props();

  const ctx = getFormContext();
</script>

<input type="hidden" {value} {...inputAttributes(ctx, config)} />
