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
    getFormContext,
    retrieveUiProps,
    type ComponentProps,
  } from "@sjsf/form";

  const { title, config }: ComponentProps["label"] = $props();

  const ctx = getFormContext();
</script>

<label
  {...retrieveUiProps(ctx, config, "labelAttributes", {
    style: "font-weight: bold;",
    for: config.id,
  })}
>
  {title}
  {#if config.required}
    <span>*</span>
  {/if}
</label>
