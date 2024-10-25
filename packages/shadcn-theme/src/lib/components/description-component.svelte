<script lang="ts">
  import type { ComponentProps } from "@sjsf/form";

  const { description }: ComponentProps<"description"> = $props();
</script>

<div class="opacity-60">{description}</div>
