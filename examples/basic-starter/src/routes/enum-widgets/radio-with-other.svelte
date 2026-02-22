<script lang="ts" module>
  import type { HTMLInputAttributes } from "svelte/elements";
  import type { Schema, SchemaValue } from "@sjsf/form";
  import type { WidgetCommonProps } from "@sjsf/form/fields/widgets";

  declare module "@sjsf/form" {
    interface ComponentProps {
      myRadioWithOtherWidget: WidgetCommonProps<SchemaValue>;
    }
    interface ComponentBindings {
      myRadioWithOtherWidget: "value";
    }
    interface UiOptions {
      myEnumValues?: Schema["enum"];
      myRadioWithOther?: HTMLInputAttributes;
      myRadioWithOtherText?: HTMLInputAttributes;
    }
    interface IdentifiableFieldElement {
      other: {};
    }
  }

  export const OTHER_VALUE = "other";
</script>

<script lang="ts">
  import {
    type ComponentProps,
    getPseudoId,
    getFormContext,
    inputAttributes,
    uiOptionProps,
    composeProps,
    handlersAttachment,
  } from "@sjsf/form";
  import { createOptions } from "@sjsf/form/fields/enum";
  import { idMapper, UNDEFINED_ID } from "@sjsf/form/options.svelte";

  let {
    value = $bindable(),
    config,
    uiOption,
    handlers,
  }: ComponentProps["myRadioWithOtherWidget"] = $props();

  const ctx = getFormContext();

  const values = $derived(uiOption("myEnumValues"));

  const attributes = $derived(
    inputAttributes(ctx, config, "myRadioWithOther", handlers, {
      type: "radio",
    })
  );

  const options = $derived(
    createOptions(ctx, config, uiOption, {
      ...config.schema,
      enum: config.schema.enum ?? values,
    }) ?? []
  );
  const mapper = $derived(idMapper(options));
  const mappedValue = $derived(mapper.fromValue(value));
  const mappedOther = $derived(mapper.fromValue(OTHER_VALUE));
  const isOther = $derived(
    typeof value === "string" &&
      (value === OTHER_VALUE || mappedValue === UNDEFINED_ID)
  );
  const mapped = {
    get current() {
      return isOther ? mappedOther : mappedValue;
    },
    set current(v) {
      value = v === mappedOther ? "" : mapper.toValue(v);
    },
  };
</script>

{#each options as option (option.id)}
  <label>
    <input
      bind:group={mapped.current}
      value={option.id}
      {...attributes}
      id={option.id}
      disabled={option.disabled || attributes.disabled}
    />
    {option.label}
  </label>
{/each}

{#if isOther}
  <input
    {...composeProps(
      ctx,
      config,
      { type: "text", id: getPseudoId(ctx, config.path, "other") },
      uiOptionProps("myRadioWithOtherText"),
      handlersAttachment(handlers)
    )}
    bind:value
  />
{/if}
