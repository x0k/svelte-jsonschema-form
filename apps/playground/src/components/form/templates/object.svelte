<script lang="ts">
import { getFormContext } from '../context';
  import { getComponent } from '../utils';

  import type { TemplateProps } from './model';

  const ctx = getFormContext()

  const { uiSchema, title, description, children, addButton }: TemplateProps<"object"> = $props();

  const Layout = $derived(getComponent(ctx, "layout", uiSchema));
  const Title = $derived(getComponent(ctx, "title", uiSchema));
  const Description = $derived(getComponent(ctx, "description", uiSchema));
</script>

<Layout type="object-field">
  {#if title !== undefined}
    <Title type="object" {title} />
  {/if}
  {#if description !== undefined}
    <Description type="object" {description} />
  {/if}
  <Layout type="object-properties">
    {@render children()}
  </Layout>
  {@render addButton?.()}
</Layout>
