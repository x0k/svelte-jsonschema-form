<script lang="ts" module>
  import "@/fields/extra-templates/array.js";
  import "@/fields/extra-components/title.js";
  import "@/fields/extra-components/description.js";
  import "@/fields/extra-components/errors-list.js";

  declare module "../fields/components.js" {
    interface LayoutTypes {
      "array-field": {};
      "array-field-meta": {};
      "array-field-title-row": {};
      "array-items": {};
    }
  }
</script>

<script lang="ts">
  import {
    getComponent,
    getFormContext,
    type ComponentProps,
  } from "@/form/index.js";

  import { getTemplateProps } from "./get-template-props.js";

  const ctx = getFormContext();

  const templateType = "arrayTemplate";

  const {
    children,
    addButton,
    action,
    uiOption,
    config,
    errors,
    value,
  }: ComponentProps[typeof templateType] = $props();

  const Layout = $derived(getComponent(ctx, "layout", config));
  const Title = $derived(getComponent(ctx, "title", config));
  const Description = $derived(getComponent(ctx, "description", config));
  const ErrorsList = $derived(getComponent(ctx, "errorsList", config));

  const { title, description, showMeta, hideContent } = $derived(
    getTemplateProps(uiOption, config)
  );
</script>

<Layout type="array-field" {config} {errors}>
  {#if showMeta && (title || description)}
    <Layout type="array-field-meta" {config} {errors}>
      {#if title}
        <Layout type="array-field-title-row" {config} {errors}>
          <Title {templateType} {title} {config} {errors} />
          {@render action?.()}
        </Layout>
      {/if}
      {#if description}
        <Description {templateType} {description} {config} {errors} />
      {/if}
    </Layout>
  {/if}
  {#if !hideContent?.(config, value)}
    <Layout type="array-items" {config} {errors}>
      {@render children()}
    </Layout>
    {@render addButton?.()}
  {/if}
  {#if errors.length > 0}
    <ErrorsList {errors} {config} />
  {/if}
</Layout>
