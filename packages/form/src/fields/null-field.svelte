<script lang="ts">
  import {
    getTemplate,
    getFormContext,
    NO_ERRORS,
    type FieldProps,
  } from "@/form/index.js";

  let { value = $bindable(), config }: FieldProps<"null"> = $props();

  $effect(() => {
    if (value === undefined) {
      value = null;
    }
  });

  const ctx = getFormContext();

  const Template = $derived(getTemplate(ctx, "field", config));
</script>

<Template errors={NO_ERRORS} showTitle {value} {config}>
  {null}
</Template>
