<script lang="ts" module>
  import type { HTMLTextareaAttributes } from "svelte/elements";
  import "@sjsf/form/fields/extra-widgets/textarea";

  declare module "@sjsf/form" {
    interface UiOptions {
      textarea?: HTMLTextareaAttributes;
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    textareaAttributes,
    type ComponentProps,
  } from "@sjsf/form";

  let {
    value = $bindable(),
    config,
    handlers,
  }: ComponentProps["textareaWidget"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    textareaAttributes(ctx, config, "textarea", handlers, {
      style: "flex-grow: 1;",
    })
  );
</script>

<textarea bind:value {...attributes}></textarea>
