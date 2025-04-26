<script lang="ts">
  import {
    getComponent,
    getFormContext,
    retrieveUiOption,
  } from "./context/index.js";
  import type { Config } from "./config.js";
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
  const text = $derived(retrieveUiOption(ctx, config, "submitButtonText"));
</script>

<Button {config}>
  {#if text}
    {text}
  {:else}
    <Text {config} id="submit" />
  {/if}
</Button>
