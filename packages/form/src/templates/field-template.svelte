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
    uiOption,
    showTitle,
    useLabel,
    errors,
  }: ComponentProps["fieldTemplate"] = $props();

  const ctx = getFormContext();

  const Layout = $derived(getComponent(ctx, "layout", config));
  const TitleOrLabel = $derived(
    getComponent(
      ctx,
      (uiOption("useLabel") ?? useLabel) ? "label" : "title",
      config
    )
  );
  const Description = $derived(getComponent(ctx, "description", config));
  const ErrorsList = $derived(getComponent(ctx, "errorsList", config));
  const Help = $derived(getComponent(ctx, "help", config));

  const { title, description, showMeta } = $derived(
    getTemplateProps(uiOption, config)
  );
  const help = $derived(uiOption("help"));
</script>

<Layout type="field" {config} {errors}>
  {#if showMeta && ((showTitle && title) || description)}
    <Layout type="field-meta" {config} {errors}>
      {#if showTitle && title}
        <TitleOrLabel type="field" {title} {config} {errors} />
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
    <ErrorsList {errors} {config} />
  {/if}
  {#if help !== undefined}
    <Help {help} {config} {errors} />
  {/if}
</Layout>
