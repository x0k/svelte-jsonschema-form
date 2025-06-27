<script lang="ts">
  import { Content, createForm, setFormContext } from "@sjsf/form";

  import { nodeSchema, nodeUiSchema, type Node } from "$lib/builder/builder.js";
  import * as defaults from "$lib/form/defaults.js";

  interface Props {
    node: Node;
  }

  let { node = $bindable() }: Props = $props();

  const form = createForm({
    ...defaults,
    initialValue: node.options,
    schema: nodeSchema(node.type),
    uiSchema: nodeUiSchema(node.type),
  });
  setFormContext(form.context);

  $effect(() => {
    node.options = form.value as any;
  });
</script>

<Content />
