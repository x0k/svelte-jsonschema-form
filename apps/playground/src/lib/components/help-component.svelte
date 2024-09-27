<script lang="ts">
  import type { ComponentProps } from '@/components/form';

  const { help, ...rest }: ComponentProps<"help"> = $props();
</script>

<p {...rest}>{help}</p>
