<script lang="ts">
  import { getTemplate, getFormContext } from '../context/index.js';
  import { NO_ERRORS } from '../errors.js';

  import type { FieldProps } from "./model.js";

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
  {null}
</Template>
