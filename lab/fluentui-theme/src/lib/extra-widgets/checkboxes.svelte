<script lang="ts" module>
  import { Checkbox } from "fluentui-svelte";
  import type { ComponentProps as SvelteComponentProps } from "svelte";
  import "@sjsf/form/fields/extra-widgets/checkboxes";

  declare module "@sjsf/form" {
    interface UiOptions {
      fluentuiCheckboxes?: Omit<
        SvelteComponentProps<typeof Checkbox>,
        "checked" | "children" | "indeterminate"
      >;
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    handlersAttachment,
    inputAttributes,
    type ComponentProps,
  } from "@sjsf/form";
  import { idMapper, multipleOptions } from "@sjsf/form/options.svelte";

  let {
    config,
    handlers,
    value = $bindable(),
    options,
    mapped = multipleOptions({
      mapper: () => idMapper(options),
      value: () => value,
      update: (v) => (value = v),
    }),
  }: ComponentProps["checkboxesWidget"] = $props();

  const selected = $derived(new Set(mapped.current));

  const ctx = getFormContext();

  // Rendered as one checkbox per option, matching every published theme, so each
  // option gets its own id, label and focusable control.
  const attributes = $derived(
    inputAttributes(ctx, config, "fluentuiCheckboxes", handlers, {})
  );
</script>

<fieldset>
  {#each options as option (option.id)}
    {@const ov = option.mappedValue ?? option.id}
    <Checkbox
      bind:checked={
        () => selected.has(ov),
        (checked) => {
          mapped.current = checked
            ? mapped.current.concat(ov)
            : mapped.current.filter((v) => v !== ov);
        }
      }
      {...handlersAttachment(handlers)(attributes)}
      id={option.id}
      disabled={option.disabled || attributes.disabled}
    >
      {option.label}
    </Checkbox>
  {/each}
</fieldset>
