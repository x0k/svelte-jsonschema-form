<script lang="ts" module>
  import type { HTMLAttributes, HTMLLabelAttributes } from "svelte/elements";

  declare module "@/form/index.js" {
    interface UiOptions {
      /**
       * Overrides the attributes of the field title.
       */
      labelAttributes?: HTMLLabelAttributes;
      /**
       * Overrides the attributes if the section title
       */
      titleAttributes?: HTMLAttributes<HTMLDivElement>;
    }
  }
</script>

<script lang="ts">
  import type { ComponentProps } from "@/form/index.js";

  const { title, type, forId, required, config }: ComponentProps<"title"> =
    $props();
</script>

{#if type === "field"}
  <label
    style="font-weight: bold;"
    for={forId}
    {...config.uiOptions?.labelAttributes}
  >
    {title}
    {#if required}
      <span>*</span>
    {/if}
  </label>
{:else}
  <div
    style="font-weight: bold; font-size: larger;"
    {...config.uiOptions?.titleAttributes}
  >
    {title}
  </div>
{/if}
