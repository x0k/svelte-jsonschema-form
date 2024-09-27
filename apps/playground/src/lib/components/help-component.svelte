<script lang="ts">
  import type { ComponentProps } from "@/components/form";

  const { help }: ComponentProps<"help"> = $props();
</script>

<div style="font-weight: 300;">{help}</div>
