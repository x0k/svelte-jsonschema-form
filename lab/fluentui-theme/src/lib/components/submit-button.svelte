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
    composeProps,
    disabledProp,
    getFormContext,
    uiOptionProps,
    type ComponentProps,
  } from "@sjsf/form";

  const { children, config }: ComponentProps["submitButton"] = $props();

  const ctx = getFormContext();
</script>

<FluentButton
  {...composeProps(
    ctx,
    config,
    {
      type: "submit",
    } satisfies SvelteComponentProps<typeof FluentButton>,
    uiOptionProps("fluentuiSubmitButton"),
    disabledProp
  )}
>
  {@render children()}
</FluentButton>
