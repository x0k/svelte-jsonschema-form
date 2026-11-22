<script lang="ts" module>
  import "#fields/extra-templates/optional-multi-field.js";
  import "../multi-field-layout.js";

  const templateType = "optionalMultiFieldTemplate";
</script>

<script lang="ts">
  import {
    getComponent,
    getFormContext,
    type ComponentProps,
  } from "#form/index.js";
  import { isNil } from "#lib/types.js";

  import { getTemplateProps } from "../get-template-props.js";

  const {
    children,
    optionSelector,
    config,
    errors,
    action,
    uiOption,
    value,
    showMeta,
  }: ComponentProps[typeof templateType] = $props();

  const ctx = getFormContext();

  const Layout = $derived(getComponent(ctx, "layout", config));
  const Title = $derived(getComponent(ctx, "title", config));
  const Description = $derived(getComponent(ctx, "description", config));

  const {
    title,
    description,
    showMeta: showMetaOption,
  } = $derived(getTemplateProps(uiOption, config));
</script>

<Layout type="multi-field" {config} {errors}>
  {#if showMeta && showMetaOption && (title || description)}
    <Layout type="multi-field-meta" {config} {errors}>
      {#if title}
        <Layout type="multi-field-title-row" {config} {errors}>
          <Title {templateType} {title} {config} {errors} />
          {@render action?.()}
        </Layout>
      {/if}
      {#if description}
        <Description {templateType} {description} {config} {errors} />
      {/if}
    </Layout>
  {/if}
  <Layout type="multi-field-controls" {config} {errors}>
    {@render optionSelector()}
  </Layout>
  {#if config.required || !isNil(value)}
    <Layout type="multi-field-content" {config} {errors}>
      {@render children()}
    </Layout>
  {/if}
</Layout>
