<script lang="ts">
  import { defaultMerger } from "@sjsf/form/core";
  import {
    Content,
    createForm,
    ON_CHANGE,
    ON_INPUT,
    setFormContext2,
  } from "@sjsf/form";
  import { omitExtraData } from "@sjsf/form/omit-extra-data";

  import type { CustomizableNode } from "$lib/builder/index.js";
  import * as defaults from "$lib/form/defaults.js";

  import { getBuilderContext } from "../context.svelte.js";

  interface Props {
    node: CustomizableNode;
  }

  let { node = $bindable() }: Props = $props();

  const ctx = getBuilderContext();

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
  setFormContext2(form);

  $effect(() => {
    if (form.fieldsValidation.isProcessed) {
      return;
    }
    node.options = omitExtraData(
      defaults.validator,
      defaultMerger,
      schema,
      form.value as any
    ) as any;
  });
</script>

<Content />
