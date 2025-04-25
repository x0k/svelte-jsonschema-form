<script lang="ts">
  import { getComponent, getFormContext } from "./context/index.js";
  import type { Config } from './config.js';
  import Text from "./text.svelte";

  const ctx = getFormContext();

  const config: Config = $derived({
    id: ctx.rootId,
    name: "submit-button",
    title: "",
    schema: ctx.schema,
    uiSchema: ctx.uiSchema,
    required: false,
  });

  const Button = $derived(getComponent(ctx, "submitButton", config));
</script>

<Button {config}>
  <Text {config} id="submit" />
</Button>
