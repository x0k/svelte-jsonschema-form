<script lang="ts">
  import {
    getFormContext,
    helpAttributes,
    type ComponentProps,
  } from "@sjsf/form";
  import "@sjsf/basic-theme/components/help.svelte";

  const { help, config }: ComponentProps["help"] = $props();

  const ctx = getFormContext();
</script>

<div
  {...helpAttributes(ctx, config, "helpAttributes", {
    style:
      "color: var(--fs-text-secondary); font-size: var(--fs-body2-font-size);",
  })}
>
  {help}
</div>
