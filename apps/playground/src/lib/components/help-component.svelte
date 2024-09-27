<script lang="ts">
  import type { ComponentProps } from '@/components/form';

  const { help, ...rest }: ComponentProps<"help"> = $props();
</script>

<div style="font-weight: 300;" {...rest}>{help}</div>
