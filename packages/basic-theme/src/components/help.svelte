<script lang="ts" module>
  import type { HTMLAttributes } from "svelte/elements";

  declare module "@sjsf/form" {
    interface UiOptions {
      /**
       * Overrides the attributes of the help.
       */
      helpAttributes?: HTMLAttributes<HTMLDivElement>;
    }
  }
</script>

<script lang="ts">
  import { getFormContext, type ComponentProps } from "@sjsf/form";

  const { help, config }: ComponentProps["help"] = $props();

  const ctx = getFormContext();
</script>

<div
  style="font-weight: 300;"
  {...config.uiOptions?.helpAttributes}
  {...ctx.extraUiOptions?.("helpAttributes", config)}
>
  {help}
</div>
