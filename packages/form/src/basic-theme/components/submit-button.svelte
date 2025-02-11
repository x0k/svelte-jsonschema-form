<script lang="ts" module>
  import type { HTMLButtonAttributes } from "svelte/elements";

  declare module "@/form/index.js" {
    interface UiOptions {
      submitButton?: HTMLButtonAttributes;
    }
  }
</script>

<script lang="ts">
  import {
    type Components,
    defineDisabled,
    getFormContext,
  } from "@/form/index.js";

  const { children, config }: Components["submitButton"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    defineDisabled(ctx, config.uiOptions?.submitButton ?? {})
  );
</script>

<button type="submit" style="width: 100%; padding: 0.5rem" {...attributes}>
  {@render children()}
</button>
