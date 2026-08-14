<script lang="ts" module>
  import type { HTMLAttributes } from "svelte/elements";
  import "@sjsf/form/fields/extra-components/description";

  declare module "@sjsf/form" {
    interface UiOptions {
      stdfDescriptionAttributes?: HTMLAttributes<HTMLDivElement>;
    }
  }
</script>

<script lang="ts">
  import {
    descriptionAttributes,
    getFormContext,
    type ComponentProps,
  } from "@sjsf/form";

  const { description, config }: ComponentProps["description"] = $props();

  const ctx = getFormContext();
</script>

<div
  {...descriptionAttributes(ctx, config, "stdfDescriptionAttributes", {
    class: "stdf-description",
  })}
>
  {description}
</div>

<style>
  :global(.stdf-description) {
    font-size: 0.8125rem;
    color: var(--color-text-primary);
    opacity: 0.7;
  }
</style>
