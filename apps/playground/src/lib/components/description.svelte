<script lang="ts">
  import type { ComponentProps } from "@/components/form";

  const { description }: ComponentProps<"description"> = $props();
</script>

<div style="font-weight: 300;">{description}</div>
