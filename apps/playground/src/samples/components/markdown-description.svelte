<script lang="ts">
  import SvelteMarkdown from 'svelte-markdown'

  import type { ComponentProps } from '@/components/form';

  import Paragraph from './paragraph.svelte';

  const { description }: ComponentProps<"description"> = $props();
</script>

<SvelteMarkdown source={description} renderers={{ paragraph: Paragraph }} />
