<script lang="ts">
import { getFormContext } from '../context';
  import { getComponent } from '../utils';

  import type { TemplateProps } from './model';

  const ctx = getFormContext()

  const { uiSchema, title, description, children, addButton }: TemplateProps<"array"> = $props();

  const Layout = $derived(getComponent(ctx, "layout", uiSchema));
</script>

<Layout type="array-field">
  {@render title?.()}
  {@render description?.()}
  <Layout type="array-items">
    {@render children()}
  </Layout>
  {@render addButton?.()}
</Layout>
