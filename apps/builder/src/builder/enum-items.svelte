<script lang="ts" module>
  const JSON_CONSTANTS = new Set(['true', 'false', 'null'])
</script>
<script lang="ts">
  import { untrack } from "svelte";
  import { identity } from "@sjsf/form/lib/function";

  import Plus from "@lucide/svelte/icons/plus";

  import { EnumValueType, nodeId, type EnumItem } from "$lib/builder/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Button } from "$lib/components/ui/button/index.js";

  import EnumItemInput from "./enum-item-input.svelte";
  import EnumDropIndicator from "./enum-drop-indicator.svelte";

  interface Props {
    items: EnumItem[];
    valueType: EnumValueType;
  }

  let { items = $bindable(), valueType }: Props = $props();

  const { toValue, defaultValue } = $derived.by(() => {
    if (valueType === EnumValueType.JSON) {
      return {
        toValue(value: string) {
          if (JSON_CONSTANTS.has(value)) {
            return value
          } 
          const num = Number(value);
          if (!isNaN(num)) {
            return num.toString();
          }
          return JSON.stringify(value);
        },
        defaultValue: '""',
      };
    }
    return { toValue: identity, defaultValue: "" };
  });

  const TYPE_TO_STRING: Record<EnumValueType, (v: string) => string> = {
    [EnumValueType.JSON]: (value: string) => {
      try {
        const parsed = JSON.parse(value);
        return typeof parsed === "string" ? parsed : value;
      } catch {
        return value;
      }
    },
    [EnumValueType.String]: identity,
  };

  let previousValueType: EnumValueType | undefined;
  $effect(() => {
    if (previousValueType !== undefined) {
      const toString = TYPE_TO_STRING[previousValueType];
      const strings = untrack(() => items.map((i) => toString(i.value)));
      for (let i = 0; i < strings.length; i++) {
        items[i].value = toValue(strings[i]);
      }
    }
    previousValueType = valueType;
  });

  let nextLabel = $state("");
  let nextValue = $state("");

  let inputEl = $state.raw<HTMLElement | null>(null);
</script>

<div class="flex flex-col gap-0.5 px-2">
  {#each items as item, i (item.id)}
    <EnumDropIndicator
      onDrop={(item) => {
        items.splice(i, 0, item);
      }}
    />
    <EnumItemInput
      bind:item={items[i]}
      {toValue}
      unmount={() => {
        items.splice(i, 1);
      }}
    />
  {/each}
  <EnumDropIndicator
    onDrop={(item) => {
      items.push(item);
    }}
  />
  <div class="grid grid-cols-[1fr_1fr_auto] gap-2 pb-2 items-center">
    <Input
      bind:ref={inputEl}
      placeholder="Enter label..."
      bind:value={
        () => nextLabel,
        (v) => {
          if (toValue(nextLabel) === nextValue) {
            nextValue = toValue(v);
          }
          nextLabel = v;
        }
      }
    />
    <Input placeholder="Enter value..." bind:value={nextValue} />
    <Button
      variant="outline"
      size="icon"
      class="size-8"
      onclick={() => {
        items.push({
          id: nodeId(),
          label: nextLabel,
          value: nextValue,
        });
        nextLabel = "";
        nextValue = defaultValue;
        inputEl?.focus();
      }}
    >
      <Plus class="size-4" />
    </Button>
  </div>
</div>
