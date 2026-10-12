<script lang="ts" module>
  import type { ButtonType } from "@sjsf/form/fields/components";
  import { Button as FluentButton } from "fluentui-svelte";
  import type { ComponentProps as SvelteComponentProps } from "svelte";

  declare module "@sjsf/form" {
    interface UiOptions {
      fluentuiButton?: SvelteComponentProps<typeof FluentButton>;
      fluentuiButtons?: {
        [B in ButtonType]: SvelteComponentProps<typeof FluentButton>;
      };
    }
  }
</script>

<script lang="ts">
  import {
    composeProps,
    disabledProp,
    getFormContext,
    uiOptionNestedProps,
    uiOptionProps,
    type ComponentProps,
  } from "@sjsf/form";

  const {
    children,
    onclick,
    config,
    disabled,
    type,
  }: ComponentProps["button"] = $props();

  const ctx = getFormContext();
</script>

<FluentButton
  {...composeProps(
    ctx,
    config,
    {
      disabled,
      // fluent's `Button` sets no default `type`, so without this the button
      // would submit the surrounding form whenever it is clicked.
      type: "button" as const,
      onclick: (e: MouseEvent) => {
        e.preventDefault();
        onclick();
      },
      children: undefined,
    },
    uiOptionProps("fluentuiButton"),
    uiOptionNestedProps("fluentuiButtons", (b) => b[type]),
    disabledProp
  )}
>
  {@render children()}
</FluentButton>
