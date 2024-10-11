<script lang="ts">
  import type { ComponentProps } from "@sjsf/form";

  const { description }: ComponentProps<"description"> = $props();
</script>

<div class="text-sm opacity-70">{description}</div>
