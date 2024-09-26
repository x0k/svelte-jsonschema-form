<script lang="ts">
import { getFormContext } from '../context';
  import { getComponent } from '../utils';

  import type { TemplateProps } from './model';

  const ctx = getFormContext()

  const { uiSchema, title, description, children, addButton }: TemplateProps<"array"> = $props();

  const Layout = $derived(getComponent(ctx, "layout", uiSchema));
  const Title = $derived(getComponent(ctx, "title", uiSchema));
  const Description = $derived(getComponent(ctx, "description", uiSchema));
</script>

<Layout type="array-field">
  {#if title !== undefined}
    <Title type="array" {title} />
  {/if}
  {#if description !== undefined}
    <Description type="array" {description} />
  {/if}
  <Layout type="array-items">
    {@render children()}
  </Layout>
  {@render addButton?.()}
</Layout>
