<script lang="ts">
  import { inputAttributes, getFormContext } from "../context/index.js";
  
  import type { FieldProps } from "./model.js";

  const { config, value = $bindable() }: FieldProps<"hidden"> = $props();

  const ctx = getFormContext();
</script>

<input {value} {...inputAttributes(ctx, config, {})} type="hidden" />
