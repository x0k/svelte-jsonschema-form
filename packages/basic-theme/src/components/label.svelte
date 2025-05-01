<script lang="ts" module>
  import type { HTMLLabelAttributes } from "svelte/elements";

  declare module "@sjsf/form" {
    interface UiOptions {
      /**
       * Overrides the attributes of the field label.
       */
      labelAttributes?: HTMLLabelAttributes;
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
  {...labelAttributes(ctx, config, "labelAttributes", {
    style: "font-weight: bold;",
  })}
>
  {title}
  {#if config.required}
    <span>*</span>
  {/if}
</label>
