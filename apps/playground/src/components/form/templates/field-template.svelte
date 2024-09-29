<script lang="ts">
  import { getComponent } from '../component';
  import { getFormContext } from '../context';
  import { getTemplateProps } from './get-template-props';
  
  import type { TemplateProps } from './model';

  const { children, config, showTitle }: TemplateProps<"field"> = $props();

  const ctx = getFormContext();

  const Layout = $derived(getComponent(ctx, "layout", config))
  const Title = $derived(getComponent(ctx, "title", config))
  const Description = $derived(getComponent(ctx, "description", config))
  const Help = $derived(getComponent(ctx, "help", config))

  const { title, description, showMeta } = $derived(getTemplateProps(config))
</script>

<Layout type="field" attributes={config.uiOptions?.container} {config}>
  {#if showMeta && ((showTitle && title) || description)}
    <Layout type="field-meta" {config}>
      {#if showTitle && title}
        <Title type="field" {title} required={config.required} forId={config.idSchema.$id} {config} />
      {/if}
      {#if description}
        <Description type="field" {description} {config} />
      {/if}
    </Layout>
  {/if}
  <Layout type="field-content" attributes={config.uiOptions?.content} {config}>
    {@render children()}
  </Layout>
  {#if config.uiOptions?.help !== undefined}
    <Help help={config.uiOptions.help} {config} />
  {/if}
</Layout>
