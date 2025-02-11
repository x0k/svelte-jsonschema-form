<script lang="ts">
  import {
    getComponent,
    getFormContext,
  } from "@/form/index.js";
  import type { TemplateProps } from '@/fields/index.js';

  const {
    children,
    keyInput,
    removeButton,
    config,
    errors,
  }: TemplateProps<"objectProperty"> = $props();

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
