<script lang="ts">
  import {
    formAttributes,
    getFormContext,
    handlers,
    type ComponentProps,
  } from "@sjsf/form";
  import "@sjsf/basic-theme/components/form.svelte";

  let {
    children,
    ref = $bindable(),
    attributes,
    config,
  }: ComponentProps["form"] = $props();

  const ctx = getFormContext();
</script>

<form
  {@attach handlers(ctx)}
  {...formAttributes(ctx, config, "form", attributes, {})}
  bind:this={ref}
>
  {@render children?.()}
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
