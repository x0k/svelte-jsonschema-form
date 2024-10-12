<script lang="ts">
  import { getFormContext } from "../context.js";
  import { getTemplate } from "../templates/index.js";
  import { getWidget } from "../widgets.js";
  import { getErrors, validateField } from '../utils.js';

  import type { FieldProps } from "./model.js";
  import { inputAttributes } from "./make-widget-attributes.js";
  import Datalist, { makeExamples } from './datalist.svelte';
  import { makeEventHandlers } from './make-event-handlers.svelte.js';

  const ctx = getFormContext();

  let { value = $bindable(), config }: FieldProps<"number"> = $props();

  const Template = $derived(getTemplate(ctx, "field", config));
  const Widget = $derived(getWidget(ctx, "number", config));
  
  const handlers = makeEventHandlers(ctx, () =>
    validateField(ctx, config, value)
  );
  const attributes = $derived(inputAttributes(ctx, config, handlers));

  const redacted = {
    get value() {
      return value;
    },
    set value(v) {
      value =
        v === null ? (config.uiOptions?.emptyValue as number | undefined) : v;
    },
  };

  const errors = $derived(getErrors(ctx, config.idSchema));

  const examples = $derived(makeExamples(config, attributes));
</script>

<Template {errors} showTitle value={redacted.value} {config}>
  <Widget {config} {errors} bind:value={redacted.value} {attributes} />
  <Datalist {examples} />
</Template>
