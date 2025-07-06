<script lang="ts">
  import {
    Content,
    createForm,
    ON_CHANGE,
    ON_INPUT,
    setFormContext,
  } from "@sjsf/form";

  import type { CustomizableNode } from "$lib/builder/index.js";
  import * as defaults from "$lib/form/defaults.js";
  import { getBuilderContext } from './context.svelte.js';

  interface Props {
    node: CustomizableNode;
  }

  let { node = $bindable() }: Props = $props();

  const ctx = getBuilderContext()

  const schema = ctx.nodeSchema(node);
  const uiSchema = ctx.nodeUiSchema(node);
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
