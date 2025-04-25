<script lang="ts">
  import {
    getComponent,
    getErrors,
    getFormContext,
    type ComponentProps,
  } from "@/form/index.js";

  let { value = $bindable(), config, uiOption }: ComponentProps["nullField"] = $props();

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
  type="template"
  showTitle
  useLabel={false}
  widgetType="nullField"
  {uiOption}
  {errors}
  {value}
  {config}
>
  {null}
</Template>
