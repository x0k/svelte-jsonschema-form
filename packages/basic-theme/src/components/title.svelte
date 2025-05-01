<script lang="ts" module>
  import type { HTMLAttributes } from "svelte/elements";

  declare module "@sjsf/form" {
    interface UiOptions {
      /**
       * Overrides the attributes of the field title
       */
      titleAttributes?: HTMLAttributes<HTMLDivElement>;
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    titleAttributes,
    type ComponentProps,
  } from "@sjsf/form";

  const { title, config, type }: ComponentProps["title"] = $props();

  const ctx = getFormContext();
</script>

<legend
  {...titleAttributes("titleAttributes")(
    {
      style: `font-weight: bold; font-size: ${type === "field" ? "unset" : "larger"};`,
    },
    config,
    ctx
  )}
>
  {title}
</legend>
