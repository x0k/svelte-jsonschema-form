<script lang="ts" module>
  import type { ButtonProps } from "@astryx-svelte/core";

  declare module "@sjsf/form" {
    interface UiOptions {
      /**
       * Overrides the Astryx Button props of the submit button.
       */
      astryxSubmitButtonAttributes?: Partial<ButtonProps>;
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
  import "@sjsf/basic-theme/components/submit-button.svelte";

  const { children, config }: ComponentProps["submitButton"] = $props();

  const ctx = getFormContext();

  const attrs = $derived(
    buttonAttributes(ctx, config, "astryxSubmitButtonAttributes", "submit", {})
  );
</script>

<Button
  label={config.title ?? "Submit"}
  variant="primary"
  size="md"
  type="submit"
  isDisabled={attrs.disabled === true}
  width="100%"
  {...attrs}
>
  {@render children()}
</Button>
