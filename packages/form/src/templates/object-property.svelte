<script lang="ts" module>
  import "@/fields/extra-templates/object-property.js";
  declare module "../fields/components.js" {
    interface LayoutTypes {
      "object-property": {};
      "object-property-key-input": {};
      "object-property-content": {};
      "object-property-controls": {};
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
    keyInput,
    removeButton,
    config,
    errors,
  }: ComponentProps["objectPropertyTemplate"] = $props();

  const ctx = getFormContext();

  const Layout = $derived(getComponent(ctx, "layout", config));
</script>

<Layout type="object-property" {config} {errors}>
  {#if keyInput}
    <Layout type="object-property-key-input" {config} {errors}>
      {@render keyInput()}
    </Layout>
  {/if}
  <Layout type="object-property-content" {config} {errors}>
    {@render children()}
  </Layout>
  {#if removeButton}
    <Layout type="object-property-controls" {config} {errors}>
      {@render removeButton()}
    </Layout>
  {/if}
</Layout>
