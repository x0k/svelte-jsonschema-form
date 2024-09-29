<script lang="ts">
import { getFormContext } from '../context';
  import { getComponent } from '../component';

  import type { TemplateProps } from './model';
  import { getTemplateProps } from './get-template-props';

  const ctx = getFormContext()

  const { config, children, addButton }: TemplateProps<"object"> = $props();

  const Layout = $derived(getComponent(ctx, "layout", config));
  const Title = $derived(getComponent(ctx, "title", config));
  const Description = $derived(getComponent(ctx, "description", config));

  const { title, description, showMeta } = $derived(getTemplateProps(config))
</script>

<Layout type="object-field" attributes={config.uiOptions?.container} {config}>
  {#if showMeta && (title || description)}
    <Layout type="object-field-meta" {config}>
      {#if title}
        <Title type="object" forId={config.idSchema.$id} required={config.required} {config} {title} />
      {/if}
      {#if description}
        <Description type="object" {description} {config}/>
      {/if}
    </Layout>
  {/if}
  <Layout type="object-properties" attributes={config.uiOptions?.content} {config}>
    {@render children()}
  </Layout>
  {@render addButton?.()}
</Layout>
