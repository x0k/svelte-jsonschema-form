<script lang="ts" module>
  import type { ButtonProps } from "@astryx-svelte/core";

  declare module "@sjsf/form" {
    interface UiOptions {
      /**
       * Overrides the Astryx Button props.
       */
      astryxButtonAttributes?: Partial<ButtonProps>;
    }
  }
</script>

<script lang="ts">
  import { Button } from "@astryx-svelte/core";
  import {
    buttonAttributes,
    getFormContext,
    type ComponentProps,
  } from "@sjsf/form";
  import "@sjsf/basic-theme/components/button.svelte";

  const { children, disabled, onclick, config }: ComponentProps["button"] =
    $props();

  const ctx = getFormContext();

  const attrs = $derived(
    buttonAttributes(ctx, config, "astryxButtonAttributes", "button", {})
  );
</script>

<Button
  label={config.title ?? "Button"}
  variant="primary"
  size="md"
  type="button"
  isDisabled={disabled}
  clickAction={onclick}
  {...attrs}
>
  {@render children()}
</Button>
