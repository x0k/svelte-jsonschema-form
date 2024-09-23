<script lang="ts">
import { getFormContext } from '../context';
  import { getComponent } from '../utils';

  import type { TemplateProps } from './model';

  const ctx = getFormContext()

  const { uiSchema, title, description, children, addButton }: TemplateProps<"object"> = $props();

  const Layout = $derived(getComponent(ctx, "layout", uiSchema));
</script>

<Layout type="object-field">
  {@render title?.()}
  {@render description?.()}
  {@render children()}
  {@render addButton?.()}
</Layout>
