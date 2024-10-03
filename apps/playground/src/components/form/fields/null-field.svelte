<script lang="ts">
  import { getFormContext } from '../context';
  import { getTemplate } from '../templates';
  import type { FieldProps } from "./model";

  let { value = $bindable(), config }: FieldProps<"null"> = $props();

  $effect(() => {
    if (value === undefined) {
      value = null;
    }
  });

  const ctx = getFormContext()

  const Template = $derived(getTemplate(ctx, "field", config))
</script>

<Template errors={[]} showTitle value={value} {config}>
  {#snippet children()}{/snippet}
</Template>
