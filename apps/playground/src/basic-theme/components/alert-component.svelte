<script lang="ts">
  import type { ComponentProps } from '@/form';

  const { title, children }: ComponentProps<"alert"> = $props();
</script>

<div>
  {#if title}
    <h3>{title}</h3>
  {/if}
  <div>
    <pre style="width: 0"><code>{@render children?.()}</code></pre>
  </div>
</div>
