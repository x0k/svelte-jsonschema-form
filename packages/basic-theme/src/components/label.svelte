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
  import type { ComponentProps } from "@sjsf/form";

  const { title, config }: ComponentProps["label"] = $props();
</script>

<label
  style="font-weight: bold;"
  for={config.id}
  {...config.uiOptions?.labelAttributes}
>
  {title}
  {#if config.required}
    <span>*</span>
  {/if}
</label>
