<script lang="ts">
import { getFormContext } from '../context.js';
import { getComponent } from '../component.js';

import type { TemplateProps } from './model.js';
import { getTemplateProps } from './get-template-props.js';

  const ctx = getFormContext()

  const { children, addButton, config, errors }: TemplateProps<"array"> = $props();

  const Layout = $derived(getComponent(ctx, "layout", config));
  const Title = $derived(getComponent(ctx, "title", config));
  const Description = $derived(getComponent(ctx, "description", config));
  const ErrorsList = $derived(getComponent(ctx, "errorsList", config));

  const { title, description, showMeta } = $derived(getTemplateProps(config))
</script>

<Layout type="array-field" attributes={config.uiOptions?.container} {config} {errors}>
  {#if showMeta && (title || description)}
    <Layout type="array-field-meta" {config} {errors}>
      {#if title}
        <Title type="array" {title} required={config.required} forId={config.idSchema.$id} {config} {errors} />
      {/if}
      {#if description}
        <Description type="array" {description} {config} {errors} />
      {/if}
    </Layout>
  {/if}
  <Layout type="array-items" attributes={config.uiOptions?.content} {config} {errors}>
    {@render children()}
  </Layout>
  {@render addButton?.()}
  {#if errors.length > 0}
    <ErrorsList {errors} {config} />
  {/if}
</Layout>
