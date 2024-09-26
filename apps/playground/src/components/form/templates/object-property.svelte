<script lang="ts">
  import { getFormContext } from '../context';
  import { getComponent } from '../utils';

  import type { TemplateProps } from './model';

  const { children, keyInput, removeButton, uiSchema }: TemplateProps<"object-property"> = $props()

  const ctx = getFormContext()

  const Layout = $derived(getComponent(ctx, "layout", uiSchema));
</script>

<Layout type="object-property">
  {#if keyInput}
    <Layout type="object-property-key-input">
      {@render keyInput()}
    </Layout>
  {/if}
  <Layout type="object-property-content">
    {@render children()}
  </Layout>
  {#if removeButton}
    <Layout type="object-property-controls">
      {@render removeButton()}
    </Layout>
  {/if}
</Layout>
