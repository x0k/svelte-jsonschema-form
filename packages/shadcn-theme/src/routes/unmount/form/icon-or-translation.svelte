<script lang="ts">
  import { getFormContext, type IconOrTranslationData } from './context/context.js';

  const ctx = getFormContext()

  const { data }: { data: IconOrTranslationData } = $props();

  const icon = $derived(ctx.icons[data[0]])
</script>

{#if icon}
  {@render icon(data as never)}
{:else}
  {ctx.translation.apply(null, data)}
{/if}
