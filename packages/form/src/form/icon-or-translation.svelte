<script lang="ts" generics="L extends Label" >
  import { getFormContext } from './context/context.js';
  import type { Label, Labels } from './translation.js'

  const ctx = getFormContext()

  const { data }: { data: [L, ...Labels[L]] } = $props();

  const icon = $derived(ctx.icons[data[0]])
</script>

{#if icon}
  {@render icon(data)}
{:else}
  {ctx.translation.apply(null, data as never)}
{/if}
