<script lang="ts">
  import { getComponent, getFormContext, NO_FIELD_ERRORS, type ComponentProps } from "@sjsf/form";

  let { value = $bindable(), config }: ComponentProps["nullField"] = $props();

  $effect(() => {
    if (value === undefined) {
      value = null;
    }
  });

  const ctx = getFormContext();

  const Template = $derived(getComponent(ctx, "fieldTemplate", config));
</script>

<Template errors={NO_FIELD_ERRORS} showTitle {value} {config}>
  {null}
</Template>
