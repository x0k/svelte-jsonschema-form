<script lang="ts">
  import type { WidgetProps } from "@/form/index.js";

  import { makeOptionsMapper } from "./options.js";

  let {
    attributes,
    value = $bindable(),
    options,
  }: WidgetProps<"checkboxes"> = $props();

  const readonly = $derived(attributes.readonly);
  const { indexToValue, valueToIndex } = $derived(makeOptionsMapper(options));

  const guarder = {
    get value() {
      return value?.map(valueToIndex) ?? [];
    },
    set value(v) {
      if (readonly) {
        return;
      }
      value = v.map(indexToValue);
    },
  };
</script>

{#each options as option, index (option.value)}
  <label>
    <input
      type="checkbox"
      bind:group={guarder.value}
      value={index}
      {...attributes}
      disabled={option.disabled || attributes.disabled}
    />
    {option.label}
  </label>
{/each}
