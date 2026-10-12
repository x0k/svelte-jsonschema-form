<script lang="ts" module>
  import { Button as FluentButton } from "fluentui-svelte";
  import type { ComponentProps as SvelteComponentProps } from "svelte";

  declare module "@sjsf/form" {
    interface UiOptions {
      fluentuiSubmitButton?: SvelteComponentProps<typeof FluentButton>;
    }
  }
</script>

<script lang="ts">
  import {
    buttonAttributes,
    getFormContext,
    type ComponentProps,
  } from "@sjsf/form";

  const { children, config }: ComponentProps["submitButton"] = $props();

  const ctx = getFormContext();
</script>

<FluentButton
  {...buttonAttributes(ctx, config, "fluentuiSubmitButton", "submit", {})}
>
  {@render children()}
</FluentButton>
