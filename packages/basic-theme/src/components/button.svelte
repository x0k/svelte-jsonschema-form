<script lang="ts" module>
  import type { HTMLButtonAttributes } from "svelte/elements";

  import type { ButtonType } from "@sjsf/form/fields/components";

  declare module "@sjsf/form" {
    interface UiOptions {
      /**
       * Overrides the attributes of any button component.
       */
      button?: HTMLButtonAttributes;
      /**
       * Overrides the attributes of a button with a specific type.
       * This override takes precedence over the `button` override, but does not replace it.
       */
      buttons?: {
        [B in ButtonType]?: HTMLButtonAttributes;
      };
    }
  }
</script>

<script lang="ts">
  import {
    defineDisabled,
    getFormContext,
    retrieveNestedUiProps,
    retrieveUiProps,
    type ComponentProps,
  } from "@sjsf/form";

  const {
    children,
    type,
    onclick,
    config,
    disabled,
  }: ComponentProps["button"] = $props();

  const ctx = getFormContext();

  function getStyle(type: ButtonType) {
    switch (type) {
      case "object-property-add":
      case "array-item-add":
        return "width: 100%; padding: 0.25rem";
      default:
        return undefined;
    }
  }

  const attributes = $derived(
    defineDisabled(
      ctx,
      retrieveNestedUiProps(
        ctx,
        config,
        "buttons",
        (p) => p[type],
        retrieveUiProps(ctx, config, "button", {
          disabled,
          type: "button",
          style: getStyle(type),
          onclick,
        })
      )
    )
  );
</script>

<button {...attributes}>
  {@render children()}
</button>
