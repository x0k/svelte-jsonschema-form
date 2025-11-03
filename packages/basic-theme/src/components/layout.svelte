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
    layoutAttributes,
    type ComponentProps,
  } from "@sjsf/form";

  const { type, children, config }: ComponentProps["layout"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    layoutAttributes(ctx, config, "layout", "layouts", type, {
      class: "basic-layout",
    })
  );
</script>

<div {...attributes}>
  {@render children()}
</div>
