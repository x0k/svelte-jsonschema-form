<script lang="ts" module>
  import type { HTMLAttributes } from "svelte/elements";

  declare module "@sjsf/form" {
    interface UiOptions {
      flowbiteRoot?: HTMLAttributes<HTMLDivElement>;
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    rootAttributes,
    type ComponentProps,
  } from "@sjsf/form";

  let { config, children }: ComponentProps["root"] = $props();

  const ctx = getFormContext();
</script>

<div
  {...rootAttributes(ctx, config, "flowbiteRoot", {
    class: "flex flex-col gap-4",
  })}
>
  {@render children?.()}
</div>
