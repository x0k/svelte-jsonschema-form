<script lang="ts">
  import type { ComponentProps } from "@sjsf/form";

  const { description }: ComponentProps<"description"> = $props();
</script>

<div class="label-text-alt">{description}</div>
