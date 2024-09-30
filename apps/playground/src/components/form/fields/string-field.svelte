<script lang="ts">
  import { getFormContext } from "../context";
  import type { Schema } from "../schema";
  import { getTemplate } from "../templates";
  import { getWidget } from "../widgets";

  import type { FieldProps } from "./model";
  import { inputAttributes } from "./make-widget-attributes";
  import { proxy } from "@/lib/svelte.svelte";

  let { config, value = $bindable() }: FieldProps<"string"> = $props();

  function widgetType({ format }: Schema) {
    if (format === undefined) {
      return "text";
    }
    switch (format) {
      case "uri":
        return "url";
      case "email":
        return format;
      default:
        console.error(`Unsupported string format: ${format}`);
        return "text";
    }
  }

  const ctx = getFormContext();

  const Template = $derived(getTemplate(ctx, "field", config));
  const Widget = $derived(getWidget(ctx, widgetType(config.schema), config));

  const attributes = $derived(inputAttributes(ctx, config));

  const redacted = proxy(() => value, {
    update(v) {
      value =
        v === "" ? (config.uiOptions?.emptyValue as string | undefined) : v;
    },
  });
</script>

<Template showTitle={true} value={redacted.value} {config}>
  <Widget {config} bind:value={redacted.value} {attributes} />
</Template>
