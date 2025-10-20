<script lang="ts" module>
  import "@/fields/extra-templates/optional-multi-field.js";

  import "../multi-field-layout.js";
</script>

<script lang="ts">
  import { isNil } from "@/lib/types.js";
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
    value,
  }: ComponentProps["optionalMultiFieldTemplate"] = $props();

  const ctx = getFormContext();

  const Layout = $derived(getComponent(ctx, "layout", config));
</script>

<Layout type="multi-field" {config} {errors}>
  <Layout type="multi-field-controls" {config} {errors}>
    {@render optionSelector()}
    {@render action?.()}
  </Layout>
  {#if config.required || !isNil(value)}
    <Layout type="multi-field-content" {config} {errors}>
      {@render children()}
    </Layout>
  {/if}
</Layout>
