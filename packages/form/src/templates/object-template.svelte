<script lang="ts">
  import { type TemplateProps, getComponent, getFormContext } from '@/form/index.js';

  import { getTemplateProps } from './get-template-props.js';

  const ctx = getFormContext()

  const { config, children, addButton, errors }: TemplateProps<"object"> = $props();

  const Layout = $derived(getComponent(ctx, "layout", config));
  const Title = $derived(getComponent(ctx, "title", config));
  const Description = $derived(getComponent(ctx, "description", config));
  const ErrorsList = $derived(getComponent(ctx, "errorsList", config));

  const { title, description, showMeta } = $derived(getTemplateProps(config))
</script>

<Layout type="object-field" {config} {errors}>
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
  <Layout type="object-properties" {config} {errors}>
    {@render children()}
  </Layout>
  {@render addButton?.()}
  {#if errors.length > 0}
    <ErrorsList forId={config.idSchema.$id} {errors} {config} />
  {/if}
</Layout>
