<script lang="ts">
  import {
    type ComponentProps,
    getFormContext,
    labelAttributes,
  } from "@sjsf/form";
  import "@sjsf/basic-theme/components/label.svelte";

  const { title, config, errors }: ComponentProps["label"] = $props();

  const ctx = getFormContext();
</script>

<label
  {...labelAttributes(ctx, config, "labelAttributes", {
    "data-error": errors.length > 0,
    "data-required": config.required,
  })}
>
  {title}
</label>

<style>
  label {
    display: block;
    font-family: var(--fs-font-family-base);
    font-size: var(--fs-body-font-size);
    line-height: var(--fs-body-line-height);
    font-weight: var(--fs-font-weight-semibold);
    color: var(--fs-text-primary);
  }

  label[data-error="true"] {
    color: var(--fs-palette-red20);
  }

  label[data-required="true"]::after {
    content: " *";
    color: var(--fs-palette-red20);
  }
</style>
