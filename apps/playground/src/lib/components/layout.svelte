<script lang="ts">
  import type { ComponentProps } from '@/components/form';

  const { children, type, ...props }: ComponentProps<"layout"> = $props();
</script>

{#if type === "array-item" || type === "array-item-controls"}
  <div {...props} style="display: flex; gap: 0.5rem; align-items: start;" >
    {@render children?.()}
  </div>
{:else if type === "array-item-content"}
  <div {...props} style="flex-grow: 1;">
    {@render children?.()}
  </div>
{:else if type === "field-content"}
  <div {...props} style="flex-grow: 1; display: flex; padding: 0.2rem 0;">
    {@render children?.()}
  </div>
{:else if type === "object-properties" || type === "array-items"}
  <div {...props} style="display: flex; flex-direction: column; gap: 0.5rem; padding-bottom: 0.5rem;" >
    {@render children?.()}
  </div>
{:else if type === "object-field" || type === "array-field"}
  <div {...props} style="padding-bottom: 0.5rem;">
    {@render children?.()}
  </div>
{:else}
  <div {...props} data-layout={type} >
    {@render children?.()}
  </div>
{/if}
