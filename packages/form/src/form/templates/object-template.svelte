<script lang="ts">
import { getFormContext } from '../context.js';
  import { getComponent } from '../component.js';

  import type { TemplateProps } from './model.js';
  import { getTemplateProps } from './get-template-props.js';

  const ctx = getFormContext()

  const { config, children, addButton, errors }: TemplateProps<"object"> = $props();

  const Layout = $derived(getComponent(ctx, "layout", config));
  const Title = $derived(getComponent(ctx, "title", config));
  const Description = $derived(getComponent(ctx, "description", config));
  const ErrorsList = $derived(getComponent(ctx, "errorsList", config));

  const { title, description, showMeta } = $derived(getTemplateProps(config))
</script>

<Layout type="object-field" attributes={config.uiOptions?.container} {config} {errors}>
  {#if showMeta && (title || description)}
    <Layout type="object-field-meta" {config} {errors}>
      {#if title}
        <Title type="object" forId={config.idSchema.$id} required={config.required} {config} {title} {errors} />
      {/if}
      {#if description}
        <Description type="object" {description} {config} {errors}/>
      {/if}
    </Layout>
  {/if}
  <Layout type="object-properties" attributes={config.uiOptions?.content} {config} {errors}>
    {@render children()}
  </Layout>
  {@render addButton?.()}
  {#if errors.length > 0}
    <ErrorsList {errors} {config} />
  {/if}
</Layout>
