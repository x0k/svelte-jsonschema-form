<script lang="ts">
  import type { ComponentProps } from '@/components/form';

  const { type: _, title, children, ...props }: ComponentProps<"alert"> = $props();
</script>

<div {...props}>
  {#if title}
    <h3>{title}</h3>
  {/if}
  <div>
    <pre style="width: 0"><code>{@render children?.()}</code></pre>
  </div>
</div>
