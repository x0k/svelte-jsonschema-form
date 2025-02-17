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
</script>

<script lang="ts">
  import { getComponent, getFormContext } from "./context/index.js";
  import Label from "./label.svelte";

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
</script>

<Button {config}>
  <Label {config} label="submit" params={{}} />
</Button>
