<script lang="ts" module>
  import type { HTMLAttributes } from "svelte/elements";

  declare module "@/form/index.js" {
    interface UiOptions {
      /**
       * Overrides the attributes of the help.
       */
      helpAttributes?: HTMLAttributes<HTMLDivElement>;
    }
  }
</script>

<script lang="ts">
  import type { ComponentProps } from "@/form/index.js";

  const { help, config }: ComponentProps<"help"> = $props();
</script>

<div style="font-weight: 300;" {...config.uiOptions?.helpAttributes}>
  {help}
</div>
