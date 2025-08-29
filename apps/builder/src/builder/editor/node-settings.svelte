<script lang="ts">
  import { untrack } from "svelte";
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

  const schema = $derived(ctx.nodeSchema(node));
  const uiSchema = $derived(ctx.nodeUiSchema(node));
  const form = createForm({
    ...defaults,
    getSnapshot(ctx) {
      return omitExtraData(
        ctx.validator,
        ctx.merger,
        schema,
        $state.snapshot(ctx.value)
      );
    },
    get initialValue() {
      return untrack(() => $state.snapshot(node.options));
    },
    get schema() {
      return schema;
    },
    get uiSchema() {
      return uiSchema;
    },
    fieldsValidationMode: ON_INPUT | ON_CHANGE,
    fieldsValidationDebounceMs: 200,
  });
  setFormContext2(form);

  $effect(() => {
    if (form.fieldsValidation.isProcessed) {
      return;
    }
    node.options = form.value as any;
  });
</script>

<Content />
