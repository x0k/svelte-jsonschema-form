<script lang="ts">
  import { getFormContext } from '../context';
  import { getComponent } from '../utils';

  import type { TemplateProps } from './model';

  const { children, buttons, uiSchema }: TemplateProps<"array-item"> = $props();

  const ctx = getFormContext()

  const Layout = $derived(getComponent(ctx, "layout", uiSchema));
</script>

<Layout type="array-item">
  <Layout type="array-item-content">
    {@render children()}
  </Layout>
  {#if buttons}
    <Layout type="array-item-controls">
      {@render buttons()}
    </Layout>
  {/if}
</Layout>
