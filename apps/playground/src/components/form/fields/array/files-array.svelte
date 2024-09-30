<script lang="ts">
  import { getFormContext } from "../../context";
  import { isSchemaObjectValue, type Schema } from "../../schema";
  import { getTemplate } from "../../templates";
  import { getWidget } from "../../widgets";

  import { inputAttributes } from "../make-widget-attributes";

  import { getArrayContext } from "./context";

  const ctx = getFormContext();
  const arrayCtx = getArrayContext();

  const Template = $derived(getTemplate(ctx, "field", arrayCtx.config));

  const schemaItems: Schema = $derived(
    isSchemaObjectValue(arrayCtx.config.schema.items)
      ? arrayCtx.config.schema.items
      : {}
  );
  const widgetConfig = $derived({ ...arrayCtx.config, schema: schemaItems });

  const Widget = $derived(getWidget(ctx, "file", widgetConfig));

  const attributes = $derived(inputAttributes(ctx, widgetConfig));
</script>

<Template showTitle={true} value={arrayCtx.value} config={arrayCtx.config}>
  <Widget
    multiple
    config={widgetConfig}
    bind:value={arrayCtx.value}
    {attributes}
  />
</Template>
