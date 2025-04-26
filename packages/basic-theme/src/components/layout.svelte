<script lang="ts" module>
  import type { HTMLAttributes } from "svelte/elements";

  import type { LayoutType } from "@sjsf/form/fields/components";

  declare module "@sjsf/form" {
    interface UiOptions {
      /**
       * Overrides the attributes of any layout component.
       */
      layout?: HTMLAttributes<HTMLDivElement>;
      /**
       * Overrides the attributes of a layout with a specific type.
       * This override takes precedence over the `layout` override, but does not replace it.
       */
      layouts?: {
        [L in LayoutType]?: HTMLAttributes<HTMLDivElement>;
      };
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    retrieveNestedUiProps,
    retrieveUiProps,
    type ComponentProps,
  } from "@sjsf/form";

  const { type, children, config }: ComponentProps["layout"] = $props();

  function getStyle(type: LayoutType) {
    switch (type) {
      case "array-item":
      case "array-item-controls":
      case "object-property":
        return "display: flex; gap: 0.2rem; align-items: start;";
      case "array-item-content":
        return "flex-grow: 1;";
      case "field-content":
        return "display: flex; gap: 0.5rem; flex-wrap: wrap;";
      case "array-items":
      case "object-properties":
      case "array-field":
      case "object-field":
      case "multi-field":
        return "display: flex; flex-direction: column; gap: 1rem;";
      case "field":
        return "display: flex; flex-direction: column; gap: 0.2rem;";
      case "field-meta":
        return "display: block;";
      case "object-property-key-input":
      case "object-property-content":
        return "flex-grow: 1;";
      // case "object-property-controls":
      // return "align-self: flex-start;";
      case "object-field-meta":
      case "array-field-meta":
        return "padding-bottom: 0;";
      default:
        return undefined;
    }
  }

  const style = $derived(getStyle(type));

  const ctx = getFormContext();

  const attributes = $derived(
    retrieveNestedUiProps(
      ctx,
      config,
      "layouts",
      (l) => l[type],
      retrieveUiProps(ctx, config, "layout", {})
    )
  );
</script>

{#if style || Object.keys(attributes).length > 0}
  <div {style} data-layout={type} {...attributes}>
    {@render children()}
  </div>
{:else}
  {@render children()}
{/if}
