<script lang="ts">
  import {
    getComponent,
    getFormContext,
  } from "@/form/index.js";

  import { getTemplateProps } from "./get-template-props.js";
  import type { TemplateProps } from '@/fields/templates.js';

  const ctx = getFormContext();

  const { children, addButton, config, errors }: TemplateProps<"array"> =
    $props();

  const Layout = $derived(getComponent(ctx, "layout", config));
  const Title = $derived(getComponent(ctx, "title", config));
  const Description = $derived(getComponent(ctx, "description", config));
  const ErrorsList = $derived(getComponent(ctx, "errorsList", config));

  const { title, description, showMeta } = $derived(getTemplateProps(config));
</script>

<Layout
  type="array-field"
  {config}
  {errors}
>
  {#if showMeta && (title || description)}
    <Layout type="array-field-meta" {config} {errors}>
      {#if title}
        <Title
          type="array"
          {title}
          required={config.required}
          forId={config.id}
          {config}
          {errors}
        />
      {/if}
      {#if description}
        <Description type="array" {description} {config} {errors} />
      {/if}
    </Layout>
  {/if}
  <Layout
    type="array-items"
    {config}
    {errors}
  >
    {@render children()}
  </Layout>
  {@render addButton?.()}
  {#if errors.length > 0}
    <ErrorsList forId={config.id} {errors} {config} />
  {/if}
</Layout>
