<script lang="ts" module>
  declare module "@sjsf/form" {
    interface UiOptions {
      stringEmptyValue?: string;
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

  let { config, value = $bindable() }: ComponentProps["stringField"] = $props();

  const ctx = getFormContext();

  const Template = $derived(getComponent(ctx, "fieldTemplate", config));
  const Widget = $derived(getComponent(ctx, "textWidget", config));

  const handlers = makeEventHandlers(ctx, () =>
    validateField(ctx, config, value)
  );

  const errors = $derived(getErrors(ctx, config.id));
</script>

<Template showTitle {value} {config} {errors}>
  <Widget
    {errors}
    {config}
    bind:value={() => value,
    (v) => (value = v === "" ? config.uiOptions?.stringEmptyValue : v)}
    {handlers}
  />
</Template>
