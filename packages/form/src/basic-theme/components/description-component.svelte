<script lang="ts">
  import type { ComponentProps } from "@/form/index.js";

  const { description }: ComponentProps<"description"> = $props();
</script>

<div style="font-weight: 300;">{description}</div>
