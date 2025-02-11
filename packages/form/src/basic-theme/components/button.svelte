<script lang="ts" module>
  import type { HTMLButtonAttributes } from "svelte/elements";

  import type { ButtonType } from "@/fields/components.js";

  declare module "@/form/index.js" {
    interface UiOptions {
      /**
       * Overrides the attributes of any button component.
       */
      button?: HTMLButtonAttributes;
      /**
       * Overrides the attributes of a button with a specific type.
       * This override takes precedence over the `button` override, but does not replace it.
       */
      buttons?: {
        [B in ButtonType]?: HTMLButtonAttributes;
      };
    }
  }
</script>

<script lang="ts">
  import {
    type Components,
    defineDisabled,
    getFormContext,
  } from "@/form/index.js";

  const { children, type, onclick, config }: Components["button"] = $props();

  const ctx = getFormContext();

  function getStyle(type: ButtonType) {
    switch (type) {
      case "object-property-add":
      case "array-item-add":
        return "width: 100%; padding: 0.25rem";
      default:
        return undefined;
    }
  }

  const attributes = $derived(
    defineDisabled(ctx, {
      ...config.uiOptions?.button,
      ...config.uiOptions?.buttons?.[type],
    })
  );
</script>

<button type="button" style={getStyle(type)} {onclick} {...attributes}>
  {@render children()}
</button>
