<script lang="ts">
  import {
    type TemplateProps,
    getComponent,
    getFormContext,
  } from "@/form/index.js";

  const { children, buttons, config, errors }: TemplateProps<"array-item"> =
    $props();

  const ctx = getFormContext();

  const Layout = $derived(getComponent(ctx, "layout", config));
</script>

<Layout type="array-item" {config} {errors}>
  <Layout type="array-item-content" {config} {errors}>
    {@render children()}
  </Layout>
  {#if buttons}
    <Layout type="array-item-controls" {config} {errors}>
      {@render buttons()}
    </Layout>
  {/if}
</Layout>
