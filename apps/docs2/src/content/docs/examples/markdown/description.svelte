<script lang="ts">
  import Markdown from "svelte-exmarkdown";

  import type { ComponentProps } from "@sjsf/form";

  const { description }: ComponentProps["description"] = $props();
</script>

<Markdown md={description}>
  {#snippet p({ children })}
    <div>{@render children?.()}</div>
  {/snippet}
</Markdown>
