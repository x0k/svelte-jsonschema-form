<script lang="ts" module>
  import type { ButtonType } from "@sjsf/form/fields/components";
  import { Button as StdfButton } from "stdf";
  import type { ComponentProps as SvelteComponentProps } from "svelte";

  declare module "@sjsf/form" {
    interface UiOptions {
      stdfButton?: SvelteComponentProps<typeof StdfButton>;
      stdfButtons?: {
        [B in ButtonType]: SvelteComponentProps<typeof StdfButton>;
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

<StdfButton
  {...composeProps(
    ctx,
    config,
    {
      disabled,
      onclick: () => onclick(),
      children,
    },
    uiOptionProps("stdfButton"),
    uiOptionNestedProps("stdfButtons", (b) => b[type]),
    disabledProp
  )}
/>
