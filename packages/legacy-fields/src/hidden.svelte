<script lang="ts">
  import { inputAttributes, getFormContext, type ComponentProps } from "@sjsf/form";

  const { config, value = $bindable() }: ComponentProps["hiddenField"] = $props();

  const ctx = getFormContext();
</script>

<input {value} {...inputAttributes(ctx, config, {}, { type: "hidden" })} />
