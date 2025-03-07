<script lang="ts">
  import { getComponent, getFormContext, type ComponentProps } from "@/form/index.js";

  let { value = $bindable(), config }: ComponentProps["nullField"] = $props();

  $effect(() => {
    if (value === undefined) {
      value = null;
    }
  });

  const ctx = getFormContext();

  const Template = $derived(getComponent(ctx, "fieldTemplate", config));
</script>

<Template errors={[]} showTitle {value} {config}>
  {null}
</Template>
