<script lang="ts">
  import type { ComponentProps } from '@/components/form';
  
  const { children, type, attributes, disabled, onclick }: ComponentProps<"button"> = $props();

  function getStyle(type: ComponentProps<"button">["type"]) {
    switch (type) {
      case "object-property-add":
      case "array-item-add":
        return "width: 100%; padding: 0.25rem";
      default:
        return undefined
    }
  }

  function getText(type: ComponentProps<"button">["type"]) {
    switch (type) {
      case "object-property-add":
        return "Add property";
      case "array-item-add":
        return "Add item";
      case "array-item-move-up":
        return "Up";
      case "array-item-move-down":
        return "Down";
      case "array-item-copy":
        return "Copy";
      case "object-property-remove":
      case "array-item-remove":
        return "Del";
      default:
        return undefined
    }
  }
</script>

{#if type === "submit"}
  <button type="submit" style="width: 100%; padding: 0.5rem" {...attributes} {disabled}>
    {@render children?.()}
  </button>
{:else}
  <button type="button" style={getStyle(type)} {...attributes} {disabled} {onclick}>
    {getText(type)}
  </button>
{/if}
