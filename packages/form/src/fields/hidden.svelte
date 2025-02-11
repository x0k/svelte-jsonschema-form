<script lang="ts">
  import { inputAttributes, getFormContext } from "@/form/index.js";

  import type { FieldProps } from "./fields.js";

  const { config, value = $bindable() }: FieldProps<"hidden"> = $props();

  const ctx = getFormContext();
</script>

<input {value} {...inputAttributes(ctx, config, {}, { type: "hidden" })} />
