<script lang="ts">
  import type { ComponentProps } from '@/components/form';
  
  const { children, type, attributes, ...props }: ComponentProps<"button"> = $props();
</script>

{#if type === "submit"}
  <button type="submit" style="width: 100%; padding: 0.5rem" {...attributes} disabled={props.disabled}>
    {@render children?.()}
  </button>
{:else if type === "object-property-add"}
  <button type="button" style="width: 100%; padding: 0.2rem" {...props}>
    Add property
  </button>
{:else if type === "object-property-remove"}
  <button type="button" {...props}>
    Del
  </button>
{:else if type === "array-item-add"}
  <button type="button" style="width: 100%; padding: 0.2rem" {...props}>
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
