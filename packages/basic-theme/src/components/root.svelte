<script lang="ts" module>
  import type { HTMLAttributes } from "svelte/elements";

  declare module "@sjsf/form" {
    interface UiOptions {
      /**
       * Overrides the attributes of the root component
       */
      root?: HTMLAttributes<HTMLDivElement>;
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    rootAttributes,
    type ComponentProps,
  } from "@sjsf/form";

  let { children, config }: ComponentProps["root"] = $props();

  const ctx = getFormContext();
</script>

<div
  {...rootAttributes(ctx, config, "root", {
    class: "sjsf-form",
  })}
>
  {@render children()}
</div>
