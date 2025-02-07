<script lang="ts">
  import {
    inputAttributes,
    getFormContext,
    type FieldProps,
  } from "@/form/index.js";

  const { config, value = $bindable() }: FieldProps<"hidden"> = $props();

  const ctx = getFormContext();
</script>

<input {value} {...inputAttributes(ctx, config, {})} type="hidden" />
