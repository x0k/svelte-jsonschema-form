<script lang="ts">
  import { getFormContext } from '../context';
  import { getComponent } from '../component';

  import type { TemplateProps } from './model';

  const { children, keyInput, removeButton, config }: TemplateProps<"object-property"> = $props()

  const ctx = getFormContext()

  const Layout = $derived(getComponent(ctx, "layout", config));
</script>

<Layout type="object-property" {config}>
  {#if keyInput}
    <Layout type="object-property-key-input" {config}>
      {@render keyInput()}
    </Layout>
  {/if}
  <Layout type="object-property-content" {config}>
    {@render children()}
  </Layout>
  {#if removeButton}
    <Layout type="object-property-controls" {config}>
      {@render removeButton()}
    </Layout>
  {/if}
</Layout>
