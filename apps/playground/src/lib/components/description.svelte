<script lang="ts">
  import type { ComponentProps } from '@/components/form';

  const { description, ...props }: ComponentProps<"description"> = $props();
</script>

<p {...props}>{description}</p>
