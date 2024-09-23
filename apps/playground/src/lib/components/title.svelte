<script lang="ts">
  import type { ComponentProps } from '@/components/form';

  const { title, ...props }: ComponentProps<"title"> = $props();
</script>

<p {...props}>{title}</p>
