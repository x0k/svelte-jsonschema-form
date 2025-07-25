<script lang="ts" module>
  import type { HTMLFormAttributes } from "svelte/elements";

  declare module "@sjsf/form" {
    interface UiOptions {
      form?: HTMLFormAttributes;
    }
  }
</script>

<script lang="ts">
  import {
    formAttributes,
    formHandlers,
    getFormContext,
    type ComponentProps,
  } from "@sjsf/form";

  let {
    children,
    ref = $bindable(),
    config,
    attributes,
  }: ComponentProps["form"] = $props();

  const ctx = getFormContext();
</script>

<form
  bind:this={ref}
  {@attach formHandlers(ctx)}
  {...formAttributes(ctx, config, "form", attributes, {
    style: "display: flex; flex-direction: column; gap: 1rem",
  })}
>
  {@render children()}
</form>
