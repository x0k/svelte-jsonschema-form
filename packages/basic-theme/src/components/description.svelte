<script lang="ts" module>
  import type { HTMLAttributes } from "svelte/elements";

  declare module "@sjsf/form" {
    interface UiOptions {
      /**
       * Overrides the attributes of the description.
       */
      descriptionAttributes?: HTMLAttributes<HTMLDivElement>;
    }
  }
</script>

<script lang="ts">
  import type { ComponentProps } from "@sjsf/form";

  const { description, config }: ComponentProps["description"] = $props();
</script>

<div style="font-weight: 300;" {...config.uiOptions?.descriptionAttributes}>
  {description}
</div>
