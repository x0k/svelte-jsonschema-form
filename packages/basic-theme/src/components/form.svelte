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
    getFormContext,
    retrieveUiProps,
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
  {...retrieveUiProps(ctx, config, "form", {
    style: "display: flex; flex-direction: column; gap: 1rem",
  })}
  {...attributes}
>
  {@render children()}
</form>
