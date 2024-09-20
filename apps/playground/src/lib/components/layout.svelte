<script lang="ts">
  import type { ComponentProps } from '@/components/form';

  const { children, type, ...props }: ComponentProps<"layout"> = $props();
</script>

<div {...props}>
  {@render children?.()}
</div>
