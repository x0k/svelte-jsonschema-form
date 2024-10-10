<script lang="ts">
  import { singleOption, type WidgetProps } from "@/form/index.js";

  let {
    attributes,
    value = $bindable(),
    options,
  }: WidgetProps<"radio"> = $props();

  const guarder = singleOption({
    options: () => options,
    value: () => value,
    update: (v) => (value = v),
    readonly: () => attributes.readonly,
  });
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
