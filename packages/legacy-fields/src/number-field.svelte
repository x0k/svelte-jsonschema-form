<script lang="ts" module>
  declare module "@sjsf/form" {
    interface UiOptions {
      numberEmptyValue?: number;
    }
  }
</script>

<script lang="ts">
  import {
    makeEventHandlers,
    getErrors,
    validateField,
    getFormContext,
    getComponent,
    type ComponentProps,
  } from "@sjsf/form";

  const ctx = getFormContext();

  let { value = $bindable(), config }: ComponentProps["numberField"] = $props();

  const Template = $derived(getComponent(ctx, "fieldTemplate", config));
  const Widget = $derived(getComponent(ctx, "numberWidget", config));

  const handlers = makeEventHandlers(ctx, () =>
    validateField(ctx, config, value)
  );

  const errors = $derived(getErrors(ctx, config.id));
</script>

<Template {errors} showTitle {value} {config}>
  <Widget
    {config}
    {errors}
    bind:value={() => value,
    (v) => (value = v === undefined ? config.uiOptions?.numberEmptyValue : v)}
    {handlers}
  />
</Template>
