<script lang="ts">
  import {
    descriptionAttributes,
    getFormContext,
    type ComponentProps,
  } from "@sjsf/form";
  import "@sjsf/basic-theme/components/description.svelte";

  const { description, config }: ComponentProps["description"] = $props();

  const ctx = getFormContext();
</script>

<div
  {...descriptionAttributes(ctx, config, "descriptionAttributes", {
    style:
      "color: var(--fs-text-secondary); font-size: var(--fs-body2-font-size);",
  })}
>
  {description}
</div>
