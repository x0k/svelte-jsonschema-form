<script lang="ts">
  import { getComponent } from '../component.js';
  import { getFormContext } from '../context.js';

  import type { TemplateProps } from './model.js';
  import { getTemplateProps } from './get-template-props.js';

  const { children, config, showTitle, errors }: TemplateProps<"field"> = $props();

  const ctx = getFormContext();

  const Layout = $derived(getComponent(ctx, "layout", config))
  const Title = $derived(getComponent(ctx, "title", config))
  const Description = $derived(getComponent(ctx, "description", config))
  const ErrorsList = $derived(getComponent(ctx, "errorsList", config))
  const Help = $derived(getComponent(ctx, "help", config))

  const { title, description, showMeta } = $derived(getTemplateProps(config))
</script>

<Layout type="field" attributes={config.uiOptions?.container} {config} {errors}>
  {#if showMeta && ((showTitle && title) || description)}
    <Layout type="field-meta" {config} {errors}>
      {#if showTitle && title}
        <Title type="field" {title} required={config.required} forId={config.idSchema.$id} {config} {errors}/>
      {/if}
      {#if description}
        <Description type="field" {description} {config} {errors} />
      {/if}
    </Layout>
  {/if}
  <Layout type="field-content" attributes={config.uiOptions?.content} {config} {errors}>
    {@render children()}
  </Layout>
  {#if errors.length > 0}
    <ErrorsList forId={config.idSchema.$id} {errors} {config} />
  {/if}
  {#if config.uiOptions?.help !== undefined}
    <Help help={config.uiOptions.help} {config} {errors} />
  {/if}
</Layout>
