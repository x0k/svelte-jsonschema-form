<script lang="ts" module>
  import type { WidgetCommonProps } from "@sjsf/form/fields/widgets";

  import type { ButtonProps } from "$lib/components/ui/button/button.svelte";

  declare module "@sjsf/form" {
    interface ComponentProps {
      myStepperWidget: WidgetCommonProps<number>;
    }
    interface ComponentBindings {
      myStepperWidget: "value";
    }
    interface UiOptions {
      myStepperWidget?: ButtonProps;
    }
  }
</script>

<script lang="ts">
  import {
    type ComponentProps,
    customInputAttributes,
    getFormContext,
  } from "@sjsf/form";
  import ChevronLeft from "@lucide/svelte/icons/chevron-left";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";

  import { Button } from "$lib/components/ui/button/index.js";

  let {
    value = $bindable(),
    config,
    handlers,
  }: ComponentProps["myStepperWidget"] = $props();

  function updateValue(delta: number) {
    value = (value ?? 0) + delta;
    handlers.onchange?.();
  }

  const ctx = getFormContext();

  const { minimum, maximum } = $derived(config.schema);
</script>

<div class="flex gap-2 w-full">
  <Button
    {...customInputAttributes(ctx, config, "myStepperWidget", {
      type: "button",
      variant: "secondary",
      size: "icon",
      disabled:
        minimum !== undefined && value !== undefined && value <= minimum,
    })}
    class="size-8"
    onclick={() => {
      updateValue(-1);
    }}
  >
    <ChevronLeft />
  </Button>
  <span class="grow text-center">
    {value}
  </span>
  <Button
    {...customInputAttributes(ctx, config, "myStepperWidget", {
      type: "button",
      variant: "secondary",
      size: "icon",
      disabled:
        maximum !== undefined && value !== undefined && value >= maximum,
    })}
    class="size-8"
    onclick={() => {
      updateValue(1);
    }}
  >
    <ChevronRight />
  </Button>
</div>
