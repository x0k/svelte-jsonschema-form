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
    composeProps,
    disabledProp,
    getFormContext,
    uiOptionProps,
    uiOptionNestedProps,
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
</script>

<button
  {...composeProps(
    ctx,
    config,
    {
      disabled,
      type: "button",
      style: getStyle(type),
      onclick,
    } satisfies HTMLButtonAttributes,
    uiOptionProps("button"),
    uiOptionNestedProps("buttons", (p) => p[type]),
    disabledProp
  )}
>
  {@render children()}
</button>
