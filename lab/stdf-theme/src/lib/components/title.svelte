<script lang="ts" module>
  import type { HTMLAttributes } from "svelte/elements";
  import "@sjsf/form/fields/extra-components/title";

  declare module "@sjsf/form" {
    interface UiOptions {
      stdfTitleAttributes?: HTMLAttributes<HTMLDivElement>;
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    titleAttributes,
    type ComponentProps,
  } from "@sjsf/form";

  const { title, config, templateType }: ComponentProps["title"] = $props();

  const ctx = getFormContext();
</script>

<legend
  {...titleAttributes(ctx, config, "stdfTitleAttributes", {
    class: "stdf-title",
    "data-template": templateType,
  })}
>
  {title}
  {#if config.required && templateType === "fieldTemplate"}
    <span class="stdf-title-required">*</span>
  {/if}
</legend>

<style>
  :global(.stdf-title) {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-primary);
  }
  :global(.stdf-title[data-template="fieldTemplate"]) {
    font-size: 0.875rem;
  }
  :global(.stdf-title[data-template="arrayFieldTemplate"]),
  :global(.stdf-title[data-template="objectFieldTemplate"]) {
    font-size: 1rem;
  }
  :global(.stdf-title-required) {
    color: var(--color-error);
  }
</style>
