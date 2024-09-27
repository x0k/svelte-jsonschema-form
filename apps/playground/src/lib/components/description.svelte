<script lang="ts">
  import type { ComponentProps } from '@/components/form';

  const { description, type, ...props }: ComponentProps<"description"> = $props();
</script>

<div style="font-weight: 300;" {...props}>{description}</div>
