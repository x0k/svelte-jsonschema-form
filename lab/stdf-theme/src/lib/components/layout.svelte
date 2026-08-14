<script lang="ts" module>
  import type { LayoutType } from "@sjsf/form/fields/components";
  import type { HTMLAttributes } from "svelte/elements";

  declare module "@sjsf/form" {
    interface UiOptions {
      stdfLayout?: HTMLAttributes<HTMLDivElement>;
      stdfLayouts?: {
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
    layoutAttributes(ctx, config, "stdfLayout", "stdfLayouts", type, {
      class: "stdf-layout",
    })
  );
</script>

<div {...attributes}>
  {@render children()}
</div>

<style>
  :global(.stdf-layout[data-layout="field-content"]) {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  :global(.stdf-layout[data-layout="field-content"] > *) {
    flex-grow: 1;
  }
  :global(.stdf-layout[data-layout="field"]) {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
  :global(.stdf-layout[data-layout="field-meta"]) {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
  :global(.stdf-layout[data-layout="array-field"]),
  :global(.stdf-layout[data-layout="object-field"]),
  :global(.stdf-layout[data-layout="object-properties"]),
  :global(.stdf-layout[data-layout="array-items"]),
  :global(.stdf-layout[data-layout="multi-field"]) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  :global(.stdf-layout[data-layout="object-property"]) {
    display: grid;
    grid-template-rows: 1fr;
    align-items: start;
    column-gap: 0.2rem;
  }
  :global(.stdf-layout[data-layout="object-property"]:has(> :nth-child(2))) {
    grid-template-columns: 1fr 1fr auto;
  }
  :global(.stdf-layout[data-layout="array-item"]),
  :global(.stdf-layout[data-layout="array-item-controls"]) {
    display: flex;
    gap: 0.2rem;
    align-items: start;
  }
  :global(.stdf-layout[data-layout="array-item-content"]),
  :global(.stdf-layout[data-layout="object-property-content"]) {
    flex-grow: 1;
  }
  :global(.stdf-layout[data-layout="field-title-row"]),
  :global(.stdf-layout[data-layout="array-field-title-row"]),
  :global(.stdf-layout[data-layout="object-field-title-row"]) {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
