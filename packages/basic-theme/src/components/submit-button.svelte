<script lang="ts" module>
  import type { HTMLButtonAttributes } from "svelte/elements";

  declare module "@sjsf/form" {
    interface UiOptions {
      submitButton?: HTMLButtonAttributes;
    }
  }
</script>

<script lang="ts">
  import {
    buttonAttributes,
    getFormContext,
    type ComponentProps,
  } from "@sjsf/form";

  const { children, config }: ComponentProps["submitButton"] = $props();

  const ctx = getFormContext();
</script>

<button
  {...buttonAttributes(ctx, config, "submitButton", "submit", {
    style: "width: 100%; padding: 0.5rem;",
  })}
>
  {@render children()}
</button>
