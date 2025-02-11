<script lang="ts" module>
  import type { Snippet } from "svelte";

  import type { Config } from "./config.js";

  declare module "./theme.js" {
    interface ComponentProps {
      submitButton: {
        config: Config;
        children: Snippet;
      };
    }
    interface ComponentBindings {
      submitButton: "";
    }
  }

  declare module "./ui-schema.js" {
    interface UiOptions {
      submitButtonTitle?: string
    }
  }
</script>

<script lang="ts">
  import { getComponent, getFormContext } from "./context/index.js";

  const ctx = getFormContext();

  const config: Config = $derived({
    id: ctx.rootId,
    name: "submit-button",
    title: "",
    schema: ctx.schema,
    uiSchema: ctx.uiSchema,
    uiOptions: ctx.uiOptions,
    required: false,
  });

  const Button = $derived(getComponent(ctx, "submitButton", config));
  const label = $derived(ctx.uiOptions?.submitButtonTitle ?? ctx.translation("submit"));
  const icon = $derived(ctx.icons.submit);
</script>

<Button {config}>
  {#if icon}
    {@render icon(["submit"])}
  {:else}
    {label}
  {/if}
</Button>
