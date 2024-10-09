<script lang="ts">
  import type { ComponentProps } from '@/form/index.js';
  
  const { children, type, attributes, disabled, onclick }: ComponentProps<"button"> = $props();

  function getStyle(type: ComponentProps<"button">["type"]) {
    switch (type) {
      case "submit":
        return "width: 100%; padding: 0.5rem";
      case "object-property-add":
      case "array-item-add":
        return "width: 100%; padding: 0.25rem";
      default:
        return undefined
    }
  }
</script>

<button type={type === "submit" ? "submit" : "button"} style={getStyle(type)} {onclick} {...attributes} {disabled}>
  {@render children()}
</button>
