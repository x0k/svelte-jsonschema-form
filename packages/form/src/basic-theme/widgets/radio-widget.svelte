<script lang="ts">
  import type { WidgetProps } from "@/form/index.js";

  import { makeOptionsMapper } from './options.js';

  let {
    attributes,
    value = $bindable(),
    options,
  }: WidgetProps<"radio"> = $props();

  const { indexToValue, valueToIndex } = $derived(makeOptionsMapper(options))

  const readonly = $derived(attributes.readonly)

  const guarder = {
    get value() {
      return valueToIndex(value)
    },
    set value(v) {
      if (readonly) {
        return
      }
      value = indexToValue(v)
    }
  }
</script>

{#each options as option, index (option.value)}
  <label>
    <input
      type="radio"
      bind:group={guarder.value}
      value={index}
      {...attributes}
      disabled={option.disabled || attributes.disabled}
    />
    {option.label}
  </label>
{/each}
