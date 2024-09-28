<script lang="ts">
  import type { ComponentProps } from "@/components/form";

  const { type, children, attributes }: ComponentProps<"layout"> = $props();

  function getStyle(type: ComponentProps<"layout">["type"]) {
    switch (type) {
      case "array-item":
      case "array-item-controls":
        return "display: flex; gap: 0.2rem; align-items: start;";
      case "array-item-content":
        return "flex-grow: 1;";
      case "field-content":
        return "display: flex; gap: 0.5rem; flex-wrap: wrap;";
      case "array-items":
      case "object-properties":
      case "array-field":
      case "object-field":
        return "display: flex; flex-direction: column; gap: 0.5rem;";
      case "field":
      case "field-meta":
        return "display: block;"
      case "object-field-meta":
      case "array-field-meta":
        return "padding-bottom: 0;";
      default:
        return undefined
    }
  }

  const style = $derived(getStyle(type));
</script>

{#if style || attributes}
  <div style={getStyle(type)} data-layout={type} {...attributes}>
    {@render children()}
  </div>
{:else}
  {@render children()}
{/if}
