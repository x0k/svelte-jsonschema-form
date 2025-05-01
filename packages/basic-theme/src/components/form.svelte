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
    enhance,
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
  use:enhance={ctx}
  {...formAttributes("form", attributes)(
    {
      style: "display: flex; flex-direction: column; gap: 1rem",
    },
    config,
    ctx
  )}
>
  {@render children()}
</form>
