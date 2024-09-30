<script lang="ts">
  import { getFormContext } from "../context";
  import type { Schema } from "../schema";
  import { getTemplate } from "../templates";
  import { getWidget } from "../widgets";

  import type { FieldProps } from "./model";
  import { inputAttributes } from "./make-widget-attributes";

  let { config, value = $bindable() }: FieldProps<"string"> = $props();

  function widgetType({ format }: Schema) {
    if (format === undefined) {
      return "text";
    }
    switch (format) {
      case "uri":
        return "url";
      case 'data-url':
        return "file";
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
</script>

<Template showTitle={true} {value} {config}>
  <Widget {config} bind:value {attributes} />
</Template>
