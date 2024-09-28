<script lang="ts">
import { getFormContext } from '../context';
  import { getComponent, getTemplateProps } from '../utils';

  import type { TemplateProps } from './model';

  const ctx = getFormContext()

  const { uiSchema, idSchema, uiOptions, name, schema, required, children, addButton }: TemplateProps<"array"> = $props();

  const Layout = $derived(getComponent(ctx, "layout", uiSchema));
  const Title = $derived(getComponent(ctx, "title", uiSchema));
  const Description = $derived(getComponent(ctx, "description", uiSchema));

  const { title, description, showMeta } = $derived(getTemplateProps(ctx, name, schema, uiOptions))
</script>

<Layout type="array-field" attributes={uiOptions?.container}>
  {#if showMeta && (title || description)}
    <Layout type="array-field-meta">
      {#if title}
        <Title type="array" {title} {required} forId={idSchema.$id} />
      {/if}
      {#if description}
        <Description type="array" {description} />
      {/if}
    </Layout>
  {/if}
  <Layout type="array-items" attributes={uiOptions?.content}>
    {@render children()}
  </Layout>
  {@render addButton?.()}
</Layout>
