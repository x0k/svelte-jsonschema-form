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
    style: "font-weight: 300;",
  })}
>
  {description}
</div>
