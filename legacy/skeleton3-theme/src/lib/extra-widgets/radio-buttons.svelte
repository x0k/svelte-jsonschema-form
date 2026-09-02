<script lang="ts" module>
  import "@sjsf/form/fields/extra-widgets/radio-buttons";
  import type { SegmentProps, SegmentItemProps } from "$lib/segment-types.js";

  declare module "@sjsf/form" {
    interface UiOptions {
      skeleton3Segment?: SegmentProps;
      skeleton3SegmentItem?: SegmentItemProps;
    }
  }
</script>

<script lang="ts">
  import {
    customInputAttributes,
    getFormContext,
    getId,
    uiOptionProps,
    type ComponentProps,
  } from "@sjsf/form";
  import { singleOption } from "@sjsf/form/options.svelte";
  import { Segment } from "@skeletonlabs/skeleton-svelte";

  let {
    config,
    handlers,
    value = $bindable(),
    options,
    mapper,
  }: ComponentProps["radioButtonsWidget"] = $props();

  const mapped = singleOption({
    mapper: () => mapper,
    value: () => value,
    update: (v) => (value = v),
  });

  const ctx = getFormContext();

  const id = $derived(getId(ctx, config.path));
</script>

<Segment
  value={mapped.current}
  {...customInputAttributes(ctx, config, "skeleton3Segment", {
    ids: {
      root: id,
    },
    name: id,
    readOnly: config.schema.readOnly,
    onValueChange: (details) => {
      mapped.current = details.value ?? "";
      handlers.oninput?.();
      handlers.onchange?.();
    },
  })}
>
  {#each options as option (option.id)}
    <Segment.Item
      {...uiOptionProps("skeleton3SegmentItem")(
        {
          value: option.mappedValue,
          disabled: option.disabled,
        },
        config,
        ctx
      )}
    >
      {option.label}
    </Segment.Item>
  {/each}
</Segment>
