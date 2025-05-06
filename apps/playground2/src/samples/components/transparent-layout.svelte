<script lang="ts">
  import type { ComponentProps } from "@sjsf/form";

  const { children }: ComponentProps["layout"] = $props();
</script>

{@render children()}
