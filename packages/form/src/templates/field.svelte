<script lang="ts">
  import {
    getComponent,
    getFormContext,
    type ComponentProps,
  } from "@/form/index.js";

  import { getTemplateProps } from "./get-template-props.js";

  const {
    children,
    config,
    showTitle,
    errors,
  }: ComponentProps["fieldTemplate"] = $props();

  const ctx = getFormContext();

  const Layout = $derived(getComponent(ctx, "layout", config));
  const Title = $derived(getComponent(ctx, "title", config));
  const Description = $derived(getComponent(ctx, "description", config));
  const ErrorsList = $derived(getComponent(ctx, "errorsList", config));
  const Help = $derived(getComponent(ctx, "help", config));

  const { title, description, showMeta } = $derived(getTemplateProps(config));
</script>

<Layout type="field" {config} {errors}>
  {#if showMeta && ((showTitle && title) || description)}
    <Layout type="field-meta" {config} {errors}>
      {#if showTitle && title}
        <Title
          type="field"
          {title}
          required={config.required}
          forId={config.id}
          {config}
          {errors}
        />
      {/if}
      {#if description}
        <Description type="field" {description} {config} {errors} />
      {/if}
    </Layout>
  {/if}
  <Layout type="field-content" {config} {errors}>
    {@render children()}
  </Layout>
  {#if errors.length > 0}
    <ErrorsList forId={config.id} {errors} {config} />
  {/if}
  {#if config.uiOptions?.help !== undefined}
    <Help help={config.uiOptions.help} {config} {errors} />
  {/if}
</Layout>
