<script lang="ts">
  import type { ComponentProps } from "@sjsf/form";

  const { help }: ComponentProps<"help"> = $props();
</script>

<div class="text-muted-foreground">{help}</div>
