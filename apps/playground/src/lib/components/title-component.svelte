<script lang="ts">
  import type { ComponentProps } from "@/components/form";
  import type { HTMLAttributes, HTMLLabelAttributes } from 'svelte/elements';

  const { title, type, forId, required }: ComponentProps<"title"> = $props();
</script>

{#if type === "field"}
  <label style="font-weight: bold" for={forId}>
    {title}
    {#if required}
      <span>*</span>
    {/if}
  </label>
{:else}
  <div style="font-weight: bold">{title}</div>
{/if}
