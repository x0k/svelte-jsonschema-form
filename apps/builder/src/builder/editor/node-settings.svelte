<script lang="ts">
  import { onDestroy, untrack } from "svelte";
  import {
    Content,
    createForm,
    ON_CHANGE,
    ON_INPUT,
    setFormContext,
    validate,
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
    validator: (options) => {
      const v = defaults.validator(options);
      return {
        ...v,
        validateFormValue(rootSchema, formValue) {
          const cleanData = omitExtraData(
            v,
            options.merger(),
            options.schema,
            formValue
          );
          return v.validateFormValue(rootSchema, cleanData);
        },
      };
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
  setFormContext(form);
  onDestroy(() => {
    form.fieldsValidation.abort()
  })

  $effect(() => {
    if (form.fieldsValidation.isProcessed) {
      return;
    }
    const { value } = validate(form)
    node.options = value as any;
  });
</script>

<Content />
