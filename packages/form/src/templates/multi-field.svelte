<script lang="ts" module>
  import "@/fields/extra-templates/multi-field.js";
  declare module "../fields/components.js" {
    interface LayoutTypes {
      "multi-field": {};
      "multi-field-content": {};
      "multi-field-controls": {};
    }
  }
</script>

<script lang="ts">
  import {
    getComponent,
    getFormContext,
    type ComponentProps,
  } from "@/form/index.js";

  const {
    children,
    optionSelector,
    config,
    errors,
    action,
  }: ComponentProps["multiFieldTemplate"] = $props();

  const ctx = getFormContext();

  const Layout = $derived(getComponent(ctx, "layout", config));
</script>

<Layout type="multi-field" {config} {errors}>
  <Layout type="multi-field-controls" {config} {errors}>
    {@render optionSelector()}
    {@render action?.()}
  </Layout>
  <Layout type="multi-field-content" {config} {errors}>
    {@render children()}
  </Layout>
</Layout>
