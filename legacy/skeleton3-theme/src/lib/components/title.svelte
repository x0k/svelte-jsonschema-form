<script lang="ts">
  import {
    getFormContext,
    titleAttributes,
    type ComponentProps,
  } from "@sjsf/form";
  import "@sjsf/basic-theme/components/title.svelte";

  const { title, templateType, config }: ComponentProps["title"] = $props();

  const ctx = getFormContext();
</script>

<div
  class={templateType === "fieldTemplate" ? "label-text" : "text-xl font-bold"}
  {...titleAttributes(ctx, config, "titleAttributes", {})}
>
  {title}
</div>
