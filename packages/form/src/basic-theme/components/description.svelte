<script lang="ts" module>
  import type { HTMLAttributes } from "svelte/elements";

  declare module "@/form/index.js" {
    interface UiOptions {
      /**
       * Overrides the attributes of the description.
       */
      descriptionContainer?: HTMLAttributes<HTMLDivElement>;
    }
  }
</script>

<script lang="ts">
  import type { ComponentProps } from "@/form/index.js";

  const { description, config }: ComponentProps["description"] = $props();
</script>

<div style="font-weight: 300;" {...config.uiOptions?.descriptionContainer}>
  {description}
</div>
