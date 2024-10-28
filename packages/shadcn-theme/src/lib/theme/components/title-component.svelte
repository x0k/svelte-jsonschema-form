<script lang="ts">
  import type { ComponentProps } from "@sjsf/form";

  import { getThemeContext } from '../context'

  const { title, type, forId, required }: ComponentProps<"title"> = $props();

  const ctx = getThemeContext();

  const { Label } = $derived(ctx.components);
</script>

{#if type === "field"}
  <Label for={forId}>
    {title}
    {#if required}
      <span>*</span>
    {/if}
  </Label>
{:else}
  <div class="text-lg font-medium">{title}</div>
{/if}
