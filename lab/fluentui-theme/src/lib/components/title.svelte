<script lang="ts">
  import {
    getFormContext,
    titleAttributes,
    type ComponentProps,
  } from "@sjsf/form";
  import "@sjsf/basic-theme/components/title.svelte";

  const { title, config, templateType, errors }: ComponentProps["title"] =
    $props();

  const ctx = getFormContext();
</script>

<div
  {...titleAttributes(ctx, config, "titleAttributes", {
    "data-template": templateType,
    "data-required": config.required,
    "data-error": errors.length > 0,
  })}
>
  {title}
</div>

<style>
  div {
    display: block;
    font-family: var(--fs-font-family-base);
    font-size: var(--fs-body-font-size);
    line-height: var(--fs-body-line-height);
    font-weight: var(--fs-font-weight-semibold);
    color: var(--fs-text-primary);
  }
  div:not([data-template="fieldTemplate"]) {
    font-size: var(--fs-subtitle2-font-size);
    font-weight: var(--fs-font-weight-semibold);
  }
  div[data-template="fieldTemplate"][data-error="true"] {
    color: var(--fs-palette-red20);
  }
  div[data-template="fieldTemplate"][data-required="true"]::after {
    content: " *";
    color: var(--fs-palette-red20);
  }
</style>
