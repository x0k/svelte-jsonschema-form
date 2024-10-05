<script lang="ts">
  import { getFormContext } from '../context';
  import { getComponent } from '../component';

  import type { TemplateProps } from './model';

  const { children, buttons, config, errors }: TemplateProps<"array-item"> = $props();

  const ctx = getFormContext()

  const Layout = $derived(getComponent(ctx, "layout", config));
</script>

<Layout type="array-item" {config} {errors}>
  <Layout type="array-item-content" {config} {errors}>
    {@render children()}
  </Layout>
  {#if buttons}
    <Layout type="array-item-controls" {config} {errors}>
      {@render buttons()}
    </Layout>
  {/if}
</Layout>
