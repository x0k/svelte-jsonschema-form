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
    getFormContext,
    retrieveInputAttributes,
    type ComponentProps,
  } from "@sjsf/form";

  const { children, config }: ComponentProps["submitButton"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    retrieveInputAttributes(ctx, config, "submitButton", () => ({
      type: "submit",
      style: "width: 100%; padding: 0.5rem;",
    }))
  );
</script>

<button {...attributes}>
  {@render children()}
</button>
