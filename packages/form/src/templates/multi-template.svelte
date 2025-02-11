<script lang="ts">
  import {
    getComponent,
    getFormContext,
  } from "@/form/index.js";
  import type { TemplateProps } from '@/fields/templates.js';

  const { children, optionSelector, config, errors }: TemplateProps<"multiField"> =
    $props();

  const ctx = getFormContext();

  const Layout = $derived(getComponent(ctx, "layout", config));
</script>

<Layout type="multi-field" {config} {errors}>
  <Layout type="multi-field-controls" {config} {errors}>
    {@render optionSelector()}
  </Layout>
  <Layout type="multi-field-content" {config} {errors}>
    {@render children()}
  </Layout>
</Layout>
