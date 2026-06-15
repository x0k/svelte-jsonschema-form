<script lang="ts">
  import {
    descriptionAttributes,
    getFormContext,
    type ComponentProps,
  } from "@sjsf/form";
  import Markdown from "svelte-exmarkdown";

  const { config, description }: ComponentProps["description"] = $props();

  const ctx = getFormContext();
</script>

<Markdown md={description}>
  {#snippet p({ children })}
    <div {...descriptionAttributes(ctx, config, "descriptionAttributes", {})}>
      {@render children?.()}
    </div>
  {/snippet}
</Markdown>
