<script lang="ts">
  import type { ComponentProps } from '@/components/form';
  
  const { children, type, ...props }: ComponentProps<"button"> = $props();
</script>

{#if type === "submit"}
  <button type="submit" {...props}>
    {@render children?.()}
  </button>
{:else if type === "add-object-property"}
  <button type="button" {...props}>
    Add property
  </button>
{:else if type === "remove-object-property"}
  <button type="button" {...props}>
    Del
  </button>
{:else if type === "add-array-item"}
  <button type="button" {...props}>
    Add item
  </button>
{:else if type === "move-up-array-item"}
  <button type="button" {...props}>
    Up
  </button>
{:else if type === "move-down-array-item"}
  <button type="button" {...props}>
    Down
  </button>
{:else if type === "copy-array-item"}
  <button type="button" {...props}>
    Copy
  </button>
{:else if type === "remove-array-item"}
  <button type="button" {...props}>
    Del
  </button>
{:else}
  Unsupported button type: "{type}"
{/if}
