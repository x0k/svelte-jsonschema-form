<script lang="ts">
  import {
    getFormContext,
    rootAttributes,
    type ComponentProps,
  } from "@sjsf/form";
  import "@sjsf/basic-theme/components/root.svelte";

  let { children, config }: ComponentProps["root"] = $props();

  const ctx = getFormContext();
</script>

<div {...rootAttributes(ctx, config, "root", {})}>
  {@render children?.()}
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
