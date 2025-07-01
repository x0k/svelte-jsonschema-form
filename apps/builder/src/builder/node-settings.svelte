<script lang="ts">
  import {
    Content,
    createForm,
    ON_CHANGE,
    ON_INPUT,
    setFormContext,
  } from "@sjsf/form";

  import {
    nodeSchema,
    nodeUiSchema,
    type CustomizableNode,
  } from "$lib/builder/index.js";
  import * as defaults from "$lib/form/defaults.js";

  interface Props {
    node: CustomizableNode;
  }

  let { node = $bindable() }: Props = $props();

  const schema = nodeSchema(node);
  const uiSchema = nodeUiSchema(node);
  const form = createForm({
    ...defaults,
    initialValue: node.options,
    schema,
    uiSchema,
    fieldsValidationMode: ON_INPUT | ON_CHANGE,
    fieldsValidationDebounceMs: 200,
  });
  setFormContext(form.context);

  $effect(() => {
    if (form.fieldsValidation.isProcessed || form.errors.size > 0) {
      return;
    }
    node.options = form.value as any;
  });
</script>

<Content />
