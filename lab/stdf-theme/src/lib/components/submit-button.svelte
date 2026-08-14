<script lang="ts" module>
  import { Button as StdfButton } from "stdf";
  import type { ComponentProps as SvelteComponentProps } from "svelte";

  declare module "@sjsf/form" {
    interface UiOptions {
      stdfSubmitButton?: SvelteComponentProps<typeof StdfButton>;
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

<StdfButton
  {...composeProps(
    ctx,
    config,
    {
      type: "submit",
      fill: "base",
      children,
    } satisfies SvelteComponentProps<typeof StdfButton>,
    uiOptionProps("stdfSubmitButton"),
    disabledProp
  )}
/>
