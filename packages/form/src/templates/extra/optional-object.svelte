<script lang="ts" module>
  import "@/fields/extra-templates/optional-object.js";
  import "@/fields/extra-components/title.js";
  import "@/fields/extra-components/description.js";
  import "@/fields/extra-components/errors-list.js";

  import "../object-layouts.js";
</script>

<script lang="ts">
  import {
    getComponent,
    getFormContext,
    type ComponentProps,
  } from "@/form/index.js";

  import { getTemplateProps } from "../get-template-props.js";

  const ctx = getFormContext();

  const templateType = "objectTemplate";

  const {
    config,
    children,
    addButton,
    action,
    errors,
    uiOption,
  }: ComponentProps[typeof templateType] = $props();

  const Layout = $derived(getComponent(ctx, "layout", config));
  const Title = $derived(getComponent(ctx, "title", config));
  const Description = $derived(getComponent(ctx, "description", config));
  const ErrorsList = $derived(getComponent(ctx, "errorsList", config));

  const { title, description, showMeta } = $derived(
    getTemplateProps(uiOption, config)
  );
</script>

<Layout type="object-field" {config} {errors}>
  {#if showMeta && (title || description)}
    <Layout type="object-field-meta" {config} {errors}>
      {#if title}
        <Layout type="object-field-title-row" {config} {errors}>
          <Title {templateType} {title} {config} {errors} />
          {@render action?.()}
        </Layout>
      {/if}
      {#if description}
        <Description {templateType} {description} {config} {errors} />
      {/if}
    </Layout>
  {/if}
  <Layout type="object-properties" {config} {errors}>
    {@render children()}
  </Layout>
  {@render addButton?.()}
  {#if errors.length > 0}
    <ErrorsList {errors} {config} />
  {/if}
</Layout>
