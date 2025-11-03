<script lang="ts" module>
  import type { HTMLLabelAttributes } from "svelte/elements";
  import "@sjsf/form/fields/extra-components/label";

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
    class: "basic-label"
  })}
>
  {title}
  {#if config.required}
    <span>*</span>
  {/if}
</label>
