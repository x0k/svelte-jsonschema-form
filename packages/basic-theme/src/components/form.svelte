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
    handlers,
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
  {@attach handlers(ctx)}
  {...formAttributes(ctx, config, "form", attributes, {
    class: "sjsf-form",
  })}
>
  {@render children()}
</form>
