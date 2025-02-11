<script lang="ts">
  import {
    getComponent,
    getFormContext,
  } from "@/form/index.js";
  import type { TemplateProps } from '@/fields/index.js';

  const { children, buttons, config, errors }: TemplateProps<"arrayItem"> =
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
