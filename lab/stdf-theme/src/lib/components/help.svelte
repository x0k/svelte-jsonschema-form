<script lang="ts" module>
  import type { HTMLAttributes } from "svelte/elements";
  import "@sjsf/form/fields/extra-components/help";

  declare module "@sjsf/form" {
    interface UiOptions {
      stdfHelpAttributes?: HTMLAttributes<HTMLDivElement>;
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    helpAttributes,
    type ComponentProps,
  } from "@sjsf/form";

  const { help, config }: ComponentProps["help"] = $props();

  const ctx = getFormContext();
</script>

<div
  {...helpAttributes(ctx, config, "stdfHelpAttributes", {
    class: "stdf-help",
  })}
>
  {help}
</div>

<style>
  :global(.stdf-help) {
    font-size: 0.8125rem;
    color: var(--color-text-primary);
    opacity: 0.7;
  }
</style>
