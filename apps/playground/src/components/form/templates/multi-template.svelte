<script lang="ts">
  import { getComponent } from '../component';
  import { getFormContext } from '../context';

  import type { TemplateProps } from './model';

  const { children, optionSelector, config }: TemplateProps<"multi"> = $props()

  const ctx = getFormContext()

  const Layout = $derived(getComponent(ctx, "layout", config))
</script>


<Layout type="multi-field" {config}>
  <Layout type="multi-field-controls" {config}>
    {@render optionSelector()}
  </Layout>
  <Layout type="multi-field-content" {config}>
    {@render children()}
  </Layout>
</Layout>
