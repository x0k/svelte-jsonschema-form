<script lang="ts">
import { getFormContext } from '../context';
import { getComponent } from '../component';

import type { TemplateProps } from './model';
import { getTemplateProps } from './get-template-props';

  const ctx = getFormContext()

  const { children, addButton, config }: TemplateProps<"array"> = $props();

  const Layout = $derived(getComponent(ctx, "layout", config));
  const Title = $derived(getComponent(ctx, "title", config));
  const Description = $derived(getComponent(ctx, "description", config));

  const { title, description, showMeta } = $derived(getTemplateProps(config))
</script>

<Layout type="array-field" attributes={config.uiOptions?.container} {config}>
  {#if showMeta && (title || description)}
    <Layout type="array-field-meta" {config}>
      {#if title}
        <Title type="array" {title} required={config.required} forId={config.idSchema.$id} {config} />
      {/if}
      {#if description}
        <Description type="array" {description} {config} />
      {/if}
    </Layout>
  {/if}
  <Layout type="array-items" attributes={config.uiOptions?.content} {config}>
    {@render children()}
  </Layout>
  {@render addButton?.()}
</Layout>
