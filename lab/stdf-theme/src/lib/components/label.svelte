<script lang="ts" module>
  import type { HTMLLabelAttributes } from "svelte/elements";
  import "@sjsf/form/fields/extra-components/label";

  declare module "@sjsf/form" {
    interface UiOptions {
      stdfLabelAttributes?: HTMLLabelAttributes;
    }
  }
</script>

<script lang="ts">
  import {
    type ComponentProps,
    getFormContext,
    labelAttributes,
  } from "@sjsf/form";

  const { title, config }: ComponentProps["label"] = $props();

  const ctx = getFormContext();
</script>

<label
  {...labelAttributes(ctx, config, "stdfLabelAttributes", {
    class: "stdf-label",
  })}
>
  {title}
  {#if config.required}
    <span class="stdf-label-required">*</span>
  {/if}
</label>

<style>
  :global(.stdf-label) {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-primary);
  }
  :global(.stdf-label-required) {
    color: var(--color-error);
  }
</style>
