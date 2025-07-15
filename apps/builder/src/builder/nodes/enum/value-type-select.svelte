<script lang="ts">
  import {
    ENUM_VALUE_TYPE_TITLES,
    ENUM_VALUE_TYPES,
    EnumValueType,
  } from "$lib/builder/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import * as Select from "$lib/components/ui/select/index.js";

  const selectId = $props.id();

  interface Props {
    value: EnumValueType;
  }

  let { value = $bindable() }: Props = $props();
</script>

<div class="flex gap-2 items-center">
  <Label class="text-muted-foreground text-base" for={selectId}>
    Value type
  </Label>
  <Select.Root type="single" bind:value>
    <Select.Trigger id={selectId} size="sm">
      {ENUM_VALUE_TYPE_TITLES[value]}
    </Select.Trigger>
    <Select.Content>
      {#each ENUM_VALUE_TYPES as t (t)}
        <Select.Item value={t}>{ENUM_VALUE_TYPE_TITLES[t]}</Select.Item>
      {/each}
    </Select.Content>
  </Select.Root>
</div>
