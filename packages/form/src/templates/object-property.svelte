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
