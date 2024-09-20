<script lang="ts">
  import type { WidgetProps } from '@/components/form';

  let { value = $bindable() }: WidgetProps<'text'> = $props();
</script>

<input type="text" bind:value />