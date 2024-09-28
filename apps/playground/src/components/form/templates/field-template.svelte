<script lang="ts">
  import { getFormContext } from '../context';
  import { getComponent, getTemplateProps } from '../utils';
  
  import type { TemplateProps } from './model';

  const { name, children, schema, uiSchema, idSchema, required, uiOptions, showTitle }: TemplateProps<"field"> = $props();

  const ctx = getFormContext();

  const Layout = $derived(getComponent(ctx, "layout", uiSchema))
  const Title = $derived(getComponent(ctx, "title", uiSchema))
  const Description = $derived(getComponent(ctx, "description", uiSchema))
  const Help = $derived(getComponent(ctx, "help", uiSchema))

  const { title, description, showMeta } = $derived(getTemplateProps(ctx, name, schema, uiOptions))
</script>

<Layout type="field" attributes={uiOptions?.container}>
  {#if showMeta && ((showTitle && title) || description)}
    <Layout type="field-meta">
      {#if showTitle && title}
        <Title type="field" {title} {required} forId={idSchema.$id} />
      {/if}
      {#if description}
        <Description type="field" {description} />
      {/if}
    </Layout>
  {/if}
  <Layout type="field-content" attributes={uiOptions?.content}>
    {@render children()}
  </Layout>
  {#if uiOptions?.help !== undefined}
    <Help help={uiOptions.help} />
  {/if}
</Layout>
