<script lang="ts">
  import Markdown, { Transparent } from "svelte-exmarkdown";
  import type { Plugin } from "svelte-exmarkdown";
  import rehypeRaw from "rehype-raw";

  import type { ComponentProps } from "@/form";

  const plugins: Plugin[] = [
    { rehypePlugin: [rehypeRaw], renderer: { p: Transparent } },
  ];

  const { description }: ComponentProps<"description"> = $props();
</script>

<div>
  <Markdown md={description} {plugins} />
</div>
