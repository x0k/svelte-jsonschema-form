<script lang="ts" module>
  import type { ButtonType } from "@sjsf/form/fields/components";
  import { Button as SvarButton } from "@svar-ui/svelte-core";
  import type { ComponentProps as SvelteComponentProps } from "svelte";

  declare module "@sjsf/form" {
    interface UiOptions {
      svarButton?: SvelteComponentProps<typeof SvarButton>;
      svarButtons?: {
        [B in ButtonType]: SvelteComponentProps<typeof SvarButton>;
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

<SvarButton
  {...composeProps(
    ctx,
    config,
    {
      // type: 'button',
      disabled,
      onclick: (e: MouseEvent) => {
        e.preventDefault();
        onclick();
      },
      children,
    },
    uiOptionProps("svarButton"),
    uiOptionNestedProps("svarButtons", (b) => b[type]),
    disabledProp
  )}
/>
