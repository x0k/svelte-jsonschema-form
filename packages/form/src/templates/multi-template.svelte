<script lang="ts">
  import {
    type TemplateProps,
    getComponent,
    getFormContext,
  } from "@/form/index.js";

  const { children, optionSelector, config, errors }: TemplateProps<"multi"> =
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
