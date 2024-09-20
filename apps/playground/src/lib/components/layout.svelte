<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  const { children, ...props }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div {...props}>
  {@render children?.()}
</div>