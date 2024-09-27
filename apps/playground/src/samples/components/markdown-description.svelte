<script lang="ts">
  import SvelteMarkdown from 'svelte-markdown'

  import type { ComponentProps } from '@/components/form';

  const { description }: ComponentProps<"description"> = $props();
</script>

<SvelteMarkdown source={description} />
