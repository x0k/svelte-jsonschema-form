<script lang="ts">
  import { getFormContext } from '../context';
  import { getTemplate } from '../templates';
  import { NO_ERRORS } from '../utils';

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

<Template errors={NO_ERRORS} showTitle value={value} {config}>
  {#snippet children()}{/snippet}
</Template>
