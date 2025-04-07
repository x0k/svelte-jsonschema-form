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
    defineDisabled,
    getFormContext,
    type ComponentProps,
  } from "@sjsf/form";

  const { children, config }: ComponentProps["submitButton"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    defineDisabled(ctx, {
      ...config.uiOptions?.submitButton,
      ...ctx.extraUiOptions?.("submitButton", config),
    })
  );
</script>

<button type="submit" style="width: 100%; padding: 0.5rem" {...attributes}>
  {@render children()}
</button>
