<script lang="ts">
  import type { ComponentProps } from '@/components/form';
  
  const { children, type, ...props }: ComponentProps<"button"> = $props();
</script>

{#if type === "submit"}
  <button type="submit" {...props}>
    {@render children?.()}
  </button>
{:else if type === "object-property-add"}
  <button type="button" {...props}>
    Add property
  </button>
{:else if type === "object-property-remove"}
  <button type="button" {...props}>
    Del
  </button>
{:else if type === "array-item-add"}
  <button type="button" {...props}>
    Add item
  </button>
{:else if type === "array-item-move-up"}
  <button type="button" {...props}>
    Up
  </button>
{:else if type === "array-item-move-down"}
  <button type="button" {...props}>
    Down
  </button>
{:else if type === "array-item-copy"}
  <button type="button" {...props}>
    Copy
  </button>
{:else if type === "array-item-remove"}
  <button type="button" {...props}>
    Del
  </button>
{:else}
  Unsupported button type: "{type}"
{/if}
