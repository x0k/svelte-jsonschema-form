<script lang="ts">
  import type { ComponentProps } from "@sjsf/form";

  const { help }: ComponentProps<"help"> = $props();
</script>

<div class="text-sm opacity-70">{help}</div>
