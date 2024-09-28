<script lang="ts">
import { getFormContext } from '../context';
  import { getComponent, getTemplateProps } from '../utils';

  import type { TemplateProps } from './model';

  const ctx = getFormContext()

  const { uiSchema, children, addButton, name, schema, uiOptions, idSchema, required }: TemplateProps<"object"> = $props();

  const Layout = $derived(getComponent(ctx, "layout", uiSchema));
  const Title = $derived(getComponent(ctx, "title", uiSchema));
  const Description = $derived(getComponent(ctx, "description", uiSchema));

  const { title, description, showMeta } = $derived(getTemplateProps(ctx, name, schema, uiOptions))
</script>

<Layout type="object-field" attributes={uiOptions?.container}>
  {#if showMeta && (title || description)}
    <Layout type="object-field-meta">
      {#if title}
        <Title type="object" forId={idSchema.$id} {required} {title} />
      {/if}
      {#if description}
        <Description type="object" {description} />
      {/if}
    </Layout>
  {/if}
  <Layout type="object-properties" attributes={uiOptions?.content}>
    {@render children()}
  </Layout>
  {@render addButton?.()}
</Layout>
