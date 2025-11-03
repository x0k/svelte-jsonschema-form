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
  onsubmit={ctx.submit}
  onreset={ctx.reset}
  {...formAttributes(ctx, config, "form", attributes, {
    class: "basic-form",
  })}
>
  {@render children()}
</form>
