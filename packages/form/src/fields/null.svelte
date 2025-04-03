<script lang="ts">
  import {
    getComponent,
    getErrors,
    getFormContext,
    type ComponentProps,
  } from "@/form/index.js";

  let { value = $bindable(), config }: ComponentProps["nullField"] = $props();

  $effect(() => {
    if (value === undefined) {
      value = null;
    }
  });

  const ctx = getFormContext();

  const Template = $derived(getComponent(ctx, "fieldTemplate", config));

  const errors = $derived(getErrors(ctx, config.id));
</script>

<Template
  showTitle
  useLabel={false}
  widgetType="nullField"
  {errors}
  {value}
  {config}
>
  {null}
</Template>
