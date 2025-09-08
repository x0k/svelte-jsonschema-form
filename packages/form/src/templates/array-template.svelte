<script lang="ts">
  import {
    getComponent,
    getFormContext,
    type ComponentProps,
  } from "@/form/index.js";

  import { getTemplateProps } from "./get-template-props.js";

  const ctx = getFormContext();

  const {
    children,
    addButton,
    uiOption,
    config,
    errors,
  }: ComponentProps["arrayTemplate"] = $props();

  const Layout = $derived(getComponent(ctx, "layout", config));
  const Title = $derived(getComponent(ctx, "title", config));
  const Description = $derived(getComponent(ctx, "description", config));
  const ErrorsList = $derived(getComponent(ctx, "errorsList", config));

  const { title, description, showMeta } = $derived(
    getTemplateProps(uiOption, config)
  );
</script>

<Layout type="array-field" {config} {errors}>
  {#if showMeta && (title || description)}
    <Layout type="array-field-meta" {config} {errors}>
      {#if title}
        <Title type="array" {title} {config} {errors} />
      {/if}
      {#if description}
        <Description type="array" {description} {config} {errors} />
      {/if}
    </Layout>
  {/if}
  <Layout type="array-items" {config} {errors}>
    {@render children()}
  </Layout>
  {@render addButton?.()}
  {#if errors.length > 0}
    <ErrorsList {errors} {config} />
  {/if}
</Layout>
