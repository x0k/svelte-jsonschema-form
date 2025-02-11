<script lang="ts">
  import { inputAttributes, getFormContext, type ComponentProps } from "@/form/index.js";

  const { config, value = $bindable() }: ComponentProps["hiddenField"] = $props();

  const ctx = getFormContext();
</script>

<input {value} {...inputAttributes(ctx, config, {}, { type: "hidden" })} />
