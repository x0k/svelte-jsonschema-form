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

  const redacted = {
    get value() {
      return value;
    },
    set value(v) {
      value = v === "" ? config.uiOptions?.stringEmptyValue : v;
    },
  };

  const errors = $derived(getErrors(ctx, config.id));
</script>

<Template showTitle value={redacted.value} {config} {errors}>
  <Widget {errors} {config} bind:value={redacted.value} {handlers} />
</Template>
